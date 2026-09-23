# FAR project page

Static, dependency-free project page (plain HTML/CSS, no build step).

```
index.html            full project page (method, figures, results, videos)
demo.html             compact qualitative demo (summary, teaser, video grids only); independent of index.html, no cross-links
static/css/style.css  styling
static/js/main.js     pauses off-screen autoplay videos
static/videos/        .mp4 result videos (H.264, muted autoplay)
static/images/        figures
```

Preview locally:

```bash
python3 serve.py 8765   # then open http://localhost:8765
```

`serve.py` is a plain static server that also honours HTTP Range requests, which browsers need to scrub
inside a video. Python's built-in `http.server` does not, so seeking only works within already-buffered data.

The three video grids are duplicated in both pages; fill the same slots in each. Search both files for `TODO` and `placeholder` to find the remaining video slots.

The manuscript folder `_ICLR27__Episodic_Memory_for_World_Models/` is gitignored and must not be pushed: it contains reviewer comments with a real name. Figures were rendered from it with `pdftoppm -r 200 -png`.

## Deploying via Anonymous GitHub

1. Push this repo to GitHub (private is fine).
2. On https://anonymous.4open.science/dashboard, anonymize the repo. Add author names, lab names, and
   the real repo name to the list of terms to be scrubbed.
3. Anonymous GitHub serves static sites at `https://anonymous.4open.science/w/<anonymized-id>/`
   (the `w/` route, not `r/`). All paths in `index.html` are relative, so nothing needs to change.

## Compressing videos

Rollout clips are re-encoded before being added (H.264, constant quality, max 30 fps, a keyframe every
2 s so scrubbing is responsive, streaming-friendly, metadata stripped). With ffmpeg on the PATH (e.g. the `pytorch` conda env):

```bash
ffmpeg -i in.mp4 -map_metadata -1 -vf "fps=min(30\,source_fps)" \
  -c:v libx264 -preset slow -crf 27 -g 60 -keyint_min 60 -sc_threshold 0 \   # -g = 2 s worth of frames (60 at 30 fps, 20 at 10 fps)
  -pix_fmt yuv420p -movflags +faststart -an out.mp4
```

Drop `-an` (and add `-c:a aac -b:a 128k`) for clips that should keep their audio.
For sources wider than 1920 px, add `,scale=1920:-2` to the `-vf` filter; panel text stays legible and the file roughly halves.
