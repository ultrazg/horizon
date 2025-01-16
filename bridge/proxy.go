package bridge

import (
	"fmt"
	"net/http"
	"net/url"
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
	proxy, err := url.Parse(proxyURL)
	if err != nil {
		return nil, err
	}

	transport := &http.Transport{
		Proxy: http.ProxyURL(proxy),
	}

	client := &http.Client{
		Transport: transport,
	}

	return client, nil
}
