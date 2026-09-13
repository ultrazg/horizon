package bridge

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
)

// 扫码登录相关常量
// horizon 依赖的 xz 服务没有提供扫码登录接口，这里直接转发到小宇宙的 web 接口
const (
	qrcodeBaseURL = "https://web-api.xiaoyuzhoufm.com/v1/auth/qrcode"
	midwayAppID   = "v6worU4NnWyL"
	accountsURL   = "https://accounts.xiaoyuzhoufm.com/"
)

type HttpRequest struct {
	http.Handler
}

func NewHttpRequest() *HttpRequest {
	return &HttpRequest{}
}

func (h *HttpRequest) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// 扫码登录请求直接转发到小宇宙 web-api
	switch r.URL.Path {
	case "/qrcode_create":
		h.proxyQrcode(w, r, qrcodeBaseURL+"/create")

		return
	case "/qrcode_login":
		h.proxyQrcode(w, r, qrcodeBaseURL+"/login")

		return
	}

	r.ContentLength = 1
	u, err := url.Parse("http://localhost:23020")
	if err != nil {
		log.Println(err.Error())
		return
	}

	proxy := httputil.ReverseProxy{
		Director: func(req *http.Request) {
			req.URL.Host = u.Host
			req.URL.Scheme = u.Scheme
			req.Host = u.Host
			body, _ := io.ReadAll(req.Body)
			req.ContentLength = int64(len(body))
			buff := bytes.NewBuffer(body)
			req.Body = io.NopCloser(buff)
		},

		ErrorLog: log.New(os.Stdout, "ReverseProxy:", log.LstdFlags|log.Lshortfile),
	}

	proxy.ServeHTTP(w, r)
}

// proxyQrcode 把扫码登录请求转发到小宇宙 web-api
func (h *HttpRequest) proxyQrcode(w http.ResponseWriter, r *http.Request, target string) {
	t, err := url.Parse(target)
	if err != nil {
		log.Println(err.Error())

		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}

	proxy := httputil.ReverseProxy{
		Director: func(req *http.Request) {
			body, _ := io.ReadAll(req.Body)
			req.ContentLength = int64(len(body))
			req.Body = io.NopCloser(bytes.NewBuffer(body))

			log.Printf("[qrcode] -> %s body:%s", t.String(), string(body))

			req.URL.Scheme = t.Scheme
			req.URL.Host = t.Host
			req.URL.Path = t.Path
			req.Host = t.Host

			req.Header.Set("Content-Type", "application/json;charset=UTF-8")
			req.Header.Set("x-midway-app-id", midwayAppID)
			req.Header.Set("Origin", accountsURL)
			req.Header.Set("Referer", accountsURL)
			req.Header.Set(
				"User-Agent",
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
			)

			// 扫码接口不需要登录态，避免带上旧 token 影响上游判断
			req.Header.Del("x-jike-access-token")
		},

		ModifyResponse: func(resp *http.Response) error {
			log.Printf(
				"[qrcode] <- %d hasToken:%v",
				resp.StatusCode,
				resp.Header.Get("x-jike-access-token") != "",
			)

			return nil
		},

		ErrorLog: log.New(os.Stdout, "QrcodeProxy:", log.LstdFlags|log.Lshortfile),
	}

	proxy.ServeHTTP(w, r)
}
