package bridge

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"time"
)

func (a *App) TestConnect(url, ip, port string) *TestConnectResult {
	proxyURL := fmt.Sprintf("http://%s:%s", ip, port)

	log.Println("proxyURL --->", proxyURL)

	client, err := HTTPClientWithProxy(proxyURL)
	if err != nil {
		log.Println(err)

		return &TestConnectResult{Flag: false, Code: 0, Err: err}
	}

	resp, err := client.Get(url)
	if err != nil {
		log.Println(err)

		return &TestConnectResult{Flag: false, Code: 0, Err: err}
	}
	defer resp.Body.Close()

	return &TestConnectResult{Flag: true, Code: resp.StatusCode, Err: nil}
}

func HTTPClientWithProxy(proxyURL string) (*http.Client, error) {
	if proxyURL == "" {
		return &http.Client{
			Timeout: time.Second * 15,
		}, nil
	}

	proxy, err := url.Parse(proxyURL)
	if err != nil {
		log.Println(err)

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

// HTTPClientForDownload 用于大文件下载，不设整体超时
// （http.Client.Timeout 会限制 body 读，导致大包必定中断）。
// 取消应通过 context 控制；阶段性超时由 Transport 字段把控。
func HTTPClientForDownload(proxyURL string) (*http.Client, error) {
	transport := &http.Transport{
		ResponseHeaderTimeout: 30 * time.Second,
		IdleConnTimeout:       90 * time.Second,
		TLSHandshakeTimeout:   15 * time.Second,
	}

	if proxyURL != "" {
		proxy, err := url.Parse(proxyURL)
		if err != nil {
			log.Println(err)
			return nil, fmt.Errorf("无法解析代理 URL: %v", err)
		}
		transport.Proxy = http.ProxyURL(proxy)
	}

	return &http.Client{
		Transport: transport,
	}, nil
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
