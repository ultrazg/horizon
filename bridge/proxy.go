package bridge

import (
	"fmt"
	"net/http"
	"net/url"
	"time"
)

type TestConnectResult struct {
	Flag bool  `json:"flag"`
	Code int   `json:"code"`
	Err  error `json:"err"`
}

func (a *App) TestConnect(url, ip, port string) *TestConnectResult {
	proxyURL := fmt.Sprintf("http://%s:%s", ip, port)

	fmt.Println("proxyURL --->", proxyURL)

	client, err := HTTPClientWithProxy(proxyURL)
	if err != nil {
		return &TestConnectResult{Flag: false, Code: 0, Err: err}
	}

	resp, err := client.Get(url)
	if err != nil {
		return &TestConnectResult{Flag: false, Code: 0, Err: err}
	}
	defer resp.Body.Close()

	return &TestConnectResult{Flag: true, Code: resp.StatusCode, Err: nil}
}

func HTTPClientWithProxy(proxyURL string) (*http.Client, error) {
	if proxyURL == "" {
		return &http.Client{}, nil
	}

	proxy, err := url.Parse(proxyURL)
	if err != nil {
		return nil, fmt.Errorf("无法解析代理 URL: %v", err)
	}

	client := &http.Client{
		Timeout: time.Second * 15,
		Transport: &http.Transport{
			Proxy: http.ProxyURL(proxy),
		},
	}

	return client, nil
}

func GetProxyInfo(a *App) string {
	proxyEnabled := a.ReadConfig("proxy.enabled").(bool)
	proxyIp := a.ReadConfig("proxy.ip").(string)
	proxyPort := a.ReadConfig("proxy.port").(string)

	if proxyEnabled && proxyIp != "" && proxyPort != "" {
		return fmt.Sprintf("http://%s:%s", proxyIp, proxyPort)
	}

	return ""
}
