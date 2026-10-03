# Regenerating the App Store screenshots

Six framed iPhone 6.9" screenshots (1320 × 2868), made from the web build
with a seeded month of sample history (`seed.mjs`, a man named Daniel).

1. `npx expo export --platform ios --platform web` and `npm run preview`
   (serves the build on http://localhost:8080).
2. Capture the raw screens at 3x (needs Google Chrome on this Mac):

   ```bash
   S=$(mktemp -d); cp design/app-store/tools/*.mjs $S; cp $S/appstore-steps.mjs $S/steps.mjs; mkdir -p $S/appstore $S/framed
   PROFILE=p W=440 H=956 DSF=3 node $S/drive.mjs $S
   ```

3. Frame them with captions, then render the frames:

   ```bash
   node $S/appstore-frame.mjs $S/appstore $S/framed
   # steps.mjs: open each framed/*.html and shot('framed/<name>')
   W=1320 H=2868 DSF=1 MOBILE=0 PROFILE=f node $S/drive.mjs $S
   ```

Captions live in `appstore-frame.mjs`. Keep them free of em dashes.
