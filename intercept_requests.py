from mitmproxy import http

def request(flow: http.HTTPFlow) -> None:
    # 打印请求的 URL
    print(f"Intercepted request: {flow.request.url}")

    # 在这里你可以修改请求的内容
    # 例如，将请求重定向到其他地址
    # flow.request.url = "https://example.com"

    # 注意：这个例子中，请求会被拦截并打印，但不会被修改，你可以根据需要修改请求内容
