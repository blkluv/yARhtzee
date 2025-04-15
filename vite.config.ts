import type { UserConfig } from "vite";
import { execSync } from "child_process";

export default () =>
  ({
    server: {
      https: { key, cert }, // uncomment for https server
    },
    plugins: [
      {
        name: "html-insert-ssr",
        transformIndexHtml(html) {
          const content = execSync(`bun --print '\
            import { renderToString } from "react-dom/server"; \
            import { createElement } from "react"; \
            import { App } from "./src/App/App"; \
            renderToString(createElement(App)) \
        '`).toString();

          return html.replace(
            `<div id="overlay"></div>`,
            `<div id="overlay">${content}</div>`
          );
        },
      },
    ],
  } satisfies UserConfig);

const key = `
-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDaH7i3vwYOnz4d
l9yZiPIeia8BDiaHmh0lqV4kbAB/utEG4fpdVcLWJdHvWwivAuR+pghNK7B06MpD
v/meKEvwSzfg1ZTC5d29eCc94lWvS0I3HYJVAXe7TqlJ/GTzpj2uwFqwZeVj2Nof
vvVFG8pJUuS1RNYUHcP2Zs70CmsCJnnjVBCMJzivjS/bvrdNIjU14Cp7IumFNN+5
lJhGXLik8MYnbSWgQcjArDJZFVV7aBfxhrVx//oxhkhGpPrCr8iOREtUNsC3Gfr3
xo5MF7v5JOxJ3Et6s4U0pbbn2f3bD4DojCZ8X9NoeyAnQahnvatxS3umBsNv8V3U
0mu8jhAxAgMBAAECggEABNQWb/TZ0rmKM7gAoWJzb6MfHWAdkLtj4UlMRPSiFzHA
vk0C0I2dNEXejZSfjtY6ziXpQaIRtCjSD2lgwnREaBOWL1MzCZRykebmwXsw5+I7
20H7OFwBtUMCwtlEN9OKgoOODmEXEJyEiZbd0ZORqQldeDjHn2bgR2RTuPnBEClU
66GLcp2aRADh63oSgRTRUKJX0PecAQAavvPNIdaf6pP+FjfAg9+5HH9TjJRvb6SN
kbW2uFA1zTcNPdB9KGmByam3BF2WKMsK0LdgVAifzNdXdTgpPFrFbnB6dtw9def0
wU+OAkZTOYKlkifd9VmIo6zvWfMnLRzZK07wzHxAFQKBgQDs0fkeQ2/j5ghr/Sbo
4dRw781nqp8+tYXdxwYYBZZuzfoqHMYQ0mDrQF/TpBI5m+n0AI0HYMQta702Z0D7
+ipFDkEqVmjn7Kpdy7Yn2Yee9eSlmCGYIl1IXsTK66ZrIS4nfARTrW0DgAlQuBaz
XSwn2ln40Iy2NPFKW+LgHPsrvQKBgQDryh2RguUkxW8S8tfdZCT6f+ynfyKTMLe+
OIPPaj3W7ZxG3MHctjDN7wnKwvSMTwSFkNe5RI1CngT8XjmbAyphdRI6hRY8P1l+
PvSk15hNz2QLeyNOL7SjO8zpGh6bIFSMrsfpEo/n+tGzw8qiPjqFXIWZy0kPyU+y
vpL5FgOjhQKBgAule+HgISWND4b4CSzUxlTThj995Zz44l94xTTzOWWznYTqq1by
ca/AF7ZZ0EejAktsp4LgYGV3cfO1+j0qHWAOBmhlnX0iZ3J7bTbifMf1gcwfAi/w
KLRBbN4p3qJQHGv2rmPLGJxedJbSptMlVuGS3G/fGbxwOBmXET5CTpvlAoGALyrR
W2hp2j88hvfZQspjs1Cf0KnYCsW2G/FGPNmt4S7LEkna5gH0JV3qAYuaS+8KooVl
AgS6lVby/GEE+QNbGP/IU7iHyCmMB3skiU0vhHE2PC231E4qvnSZ+w9ki/edsj7M
cs1pyCgehu1lvarhHghyGV/XD7dfoAwLbpR+ydkCgYAFrp9bXGXqIGJEhXQ0gdKE
nclJa28j+HfD9jnWRbOVUXC6FIN2Np+NfuZZKK3irthNrsw+xCzrzeznBzpPs2gz
GxmFJizT4H/QXtu49sBI0UiW2xEZ37gKFmnVlqLTgRIb8NWKtHagwrdnJr0z3m5k
8tJ6Xq4vutsZey/+p/iX7g==
-----END PRIVATE KEY-----
`;
const cert = `
-----BEGIN CERTIFICATE-----
MIIDETCCAfkCFCC85ljW9Q9cQIOUeFHkzgO+i4rpMA0GCSqGSIb3DQEBCwUAMEUx
CzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRl
cm5ldCBXaWRnaXRzIFB0eSBMdGQwHhcNMjUwMzE0MTIzMDA5WhcNMjYwMzE0MTIz
MDA5WjBFMQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UE
CgwYSW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOC
AQ8AMIIBCgKCAQEA2h+4t78GDp8+HZfcmYjyHomvAQ4mh5odJaleJGwAf7rRBuH6
XVXC1iXR71sIrwLkfqYITSuwdOjKQ7/5nihL8Es34NWUwuXdvXgnPeJVr0tCNx2C
VQF3u06pSfxk86Y9rsBasGXlY9jaH771RRvKSVLktUTWFB3D9mbO9AprAiZ541QQ
jCc4r40v2763TSI1NeAqeyLphTTfuZSYRly4pPDGJ20loEHIwKwyWRVVe2gX8Ya1
cf/6MYZIRqT6wq/IjkRLVDbAtxn698aOTBe7+STsSdxLerOFNKW259n92w+A6Iwm
fF/TaHsgJ0GoZ72rcUt7pgbDb/Fd1NJrvI4QMQIDAQABMA0GCSqGSIb3DQEBCwUA
A4IBAQA13HNJe7G6pcrEeatIOU1uofuPRcx2czpAxV01sPwLPQewyhgCjdIGZhhy
MN/8J6+AzfSzo3JDosTuAGyKM258RvnYmkwXnwj5PeUwXbKDs33Sx3uh6UL+N7e7
p6zS3CELTDXuHxNOcw67v10jwzMB8p6zjd1j4J+yPuexh9MOuujPFLUYSipE2ONg
z4rVkSvh2v4a7GeMiZ5TqhMaPdv7Bzj3Ckr/P1sE0CRPdbXrbZcvjcXo6XLawuDk
wwvjm+uF6TFOkefLdcZXF57rD6JsOHKYPxQQuJzvuadeXDZ2LpmXDFbliopDxJw5
bUP6q7uiyBFQTdlgZ3IxFUfNv3pm
-----END CERTIFICATE-----
`;
