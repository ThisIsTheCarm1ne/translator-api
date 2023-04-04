# translator-api

I made this API as a part of a bigger series of API I want to develop.

Basicly it translates text. That's all.

## Usage:

1. Run this API with `cd translator-api && node .`
1. Send a post request with the following - `textToTranslate: 'Hello, World!', translateTo: 'Czech'`
1. Get response with translated text - `translatedText: 'Hallo, Welt!'`

In post request you can use not only language name, but also language code, e.g - `cz`
