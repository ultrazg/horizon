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

type HttpRequest struct {
	http.Handler
}

func NewHttpRequest() *HttpRequest {
	return &HttpRequest{}
}

func (h *HttpRequest) ServeHTTP(w http.ResponseWriter, r *http.Request) {
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
