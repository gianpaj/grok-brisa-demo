# Hotel photography

Place these three web-optimized JPGs in this folder:

| File | Size | Subject |
|------|------|--------|
| `terrace.jpg` | ~43 KB | Sea-facing terrace (1200×675) |
| `lobby.jpg` | ~48 KB | Quiet lobby desk (1200×800) |
| `breeze.jpg` | ~46 KB | Linen curtain / morning light (1200×900) |

## Add the images

The GitHub file API used for this demo only accepts text, so binaries need a local push:

```bash
git clone https://github.com/gianpaj/grok-brisa-demo.git
cd grok-brisa-demo

# Drop the three JPGs into public/images/
# (from the hello-brisa-hotel-images.zip Grok prepared)

git add public/images/*.jpg
git commit -m "Add compressed hotel images for Moments section"
git push
```

Compressed from original ~175–200 KB stills → max 1200px wide, JPEG quality ~58.
