const fs = require('fs/promises');
const path = require('path');

const base = 'https://wn7lso8ghdka.stremio.com/hisense/1.10.0/';
const targetDir = process.argv[2];

if (!targetDir) {
  throw new Error('Usage: node scripts/deploy-hisense-patch.js <target-dir>');
}

async function download(name) {
  const response = await fetch(base + name);
  if (!response.ok) {
    throw new Error(`${name}: ${response.status}`);
  }

  return response.text();
}

function once(source, from, to, label) {
  if (!source.includes(from)) {
    throw new Error(`Missing patch target: ${label}`);
  }

  return source.replace(from, () => to);
}

function patchMain(source) {
  source = once(source, "@font-face {\\n  font-family: 'PlusJakartaSans';\\n  font-weight: 100 1000;\\n  src: url(${d}) format('truetype');\\n}", "/* @font-face removed */) format('truetype');\\n}", 'main font face');
  source = source.replaceAll("font-family: 'PlusJakartaSans';", 'font-family: sans-serif;');
  source = once(source, "font-family: 'PlusJakartaSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;", 'font-family: sans-serif;', 'main body font');
  source = once(source, 'seekNext:[418,417,176,208]}', 'seekNext:[418,417,176,208],green:[404],yellow:[405]}', 'main remote key map');
  source = once(source, 'const Qt=e=>{const{ref:t,focus:n}=(0,i.Wc)(),a=()=>{n()},l=({target:t})=>{const{value:n}=t;e.onInput&&e.onInput(n)},s=({target:t})=>{const{value:n}=t;e.onChange&&e.onChange(n)},c=({target:t})=>{const{value:n}=t;e.onSubmit&&e.onSubmit(n)};return(0,o.Rc)((()=>{e.autoFocus&&n()})),(u=Xt()).addEventListener("submit",c),u.addEventListener("change",s),u.$$input=l', 'const Qt=e=>{const{ref:t,focus:n}=(0,i.Wc)(),a=()=>{n()},l=({target:t})=>{const{value:n}=t;e.onInput&&e.onInput(n)},s=({target:t})=>{const{value:n}=t;e.onChange&&e.onChange(n)},c=({target:t})=>{const{value:n}=t;e.onSubmit&&e.onSubmit(n)},d=t=>{const n=t.keyCode||t.which;(13===n||405===n)&&(t.preventDefault(),e.onSubmit&&e.onSubmit(t.target.value)),e.onKeyDown&&e.onKeyDown(t)};return(0,o.Rc)((()=>{e.autoFocus&&n()})),(u=Xt()).addEventListener("submit",c),u.addEventListener("change",s),u.addEventListener("keydown",d),u.$$input=l', 'main text input keydown');
  source = once(source, 't("seekNext")&&(e.preventDefault(),y("seekNext"))}', 't("seekNext")&&(e.preventDefault(),y("seekNext")),t("green")&&(e.preventDefault(),y("green")),t("yellow")&&(e.preventDefault(),y("yellow"))}', 'main color key dispatch');
  source = once(source, 't("back")&&U(e,(()=>{y("back")}))', 't("back")&&(e.preventDefault(),y("back"))', 'main global back dispatch');

  return source;
}

function patchSearch(source) {
  source = once(source, '[E,w]=(0,a.n5)(null),[C,Y,K]=(0,o.zD)(),k=()=>', '[E,w]=(0,a.n5)(null),[C,Y,K]=(0,o.zD)(),q=(0,G.cq)(),k=()=>', 'search nav service');
  source = once(source, 'P=e=>{g({query:e})},T=e=>{b(e)}', 'P=e=>{g({query:e})},D=()=>{P(k())},B=e=>{const n=e.keyCode||e.which;(13===n||405===n)&&(e.preventDefault(),P(e.target.value))},T=e=>{b(e)}', 'search submit handlers');
  source = once(source, '(0,a.Ki)((()=>{v.unload()}))', '(0,a.Rc)((()=>{q.on("yellow",D)})),(0,a.Ki)((()=>{q.off("yellow",D),v.unload()}))', 'search yellow lifecycle');
  source = once(source, 'get children(){return(0,a.a0)(l.ks,{get placeholder(){return d("STREMIO_TV_SEARCH_PLACEHOLDER")},get value(){return k()},autoFocus:!0,onChange:P,onSubmit:P})}})', 'get children(){return[(0,a.a0)(l.ks,{get placeholder(){return d("STREMIO_TV_SEARCH_PLACEHOLDER")},get value(){return k()},autoFocus:!0,onInput:P,onChange:P,onSubmit:P,onKeyDown:B}),(0,a.a0)(l.$n,{icon:"search",onPress:D})]}})', 'search button');
  source = once(source, 'padding: 2rem 4rem 1rem 4rem;\\n}\\n.search-guyhx .container-RxHME', 'padding: 2rem 4rem 1rem 4rem;\\n  display: flex;\\n  flex-direction: row;\\n  align-items: center;\\n}\\n.search-guyhx .heading-AvPuR > input {\\n  flex: 1 1 auto;\\n  min-width: 0;\\n}\\n.search-guyhx .heading-AvPuR > :last-child {\\n  flex: 0 0 auto;\\n  margin-left: 1rem;\\n}\\n.search-guyhx .container-RxHME', 'search CSS');

  return source;
}

function patchPlayer(source) {
  source = once(source, 'yn=()=>{!nn()&&!tn()&&!V()&&!j()&&we()},Sn=()=>{E(),Y(),L(),U(),q(),ne(),ie()},xn=()=>{Ie(!0),_(),we()};return', 'yn=()=>{!nn()&&!tn()&&!V()&&!j()&&we()},Sn=()=>{E(),Y(),L(),U(),q(),ne(),ie()},wn=()=>{Sn(),H()},xn=()=>{Ie(!0),_(),we()};return', 'player green handler');
  source = once(source, 'f.on("ok",kn),f.on("any",fn)', 'f.on("ok",kn),f.on("green",wn),f.on("any",fn)', 'player green listener');
  source = once(source, 'f.off("ok",kn),f.off("any",fn)', 'f.off("ok",kn),f.off("green",wn),f.off("any",fn)', 'player green cleanup');
  source = once(source, '(0,r.Yr)(n,(0,o.a0)(o.wv,{get when(){return Ze.audio().length},get children(){return(0,o.a0)(D,{icon:"audio",onClick:H})}}),null)', '(0,r.Yr)(n,(0,o.a0)(D,{icon:"audio",onClick:H}),null)', 'player audio button');

  return source;
}

function patchVideo(source) {
  source = once(source, '"Vidaa"===e.platform?h(f(l)):h(f(a))', '"Vidaa"===e.platform?h(f(a)):h(f(a))', 'video Vidaa streaming implementation');
  source = once(source, '"Vidaa"===e.platform?g(f(l)):g(f(a))', '"Vidaa"===e.platform?g(f(a)):g(f(a))', 'video Vidaa direct implementation');
  source = once(source, 'return(n.forceTranscoding?Promise.resolve(!1):t.canPlayStream({url:r},f))', 'return(n.forceTranscoding||"Vidaa"===n.platform?Promise.resolve(!1):t.canPlayStream({url:r},f))', 'video Vidaa HLS force');

  return source;
}

function indexHtml() {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="theme-color" content="#000000"/><title>Stremio - Freedom to Stream (Hisense Vidaa)</title><link rel="stylesheet" href="font-override.css"/><style>* { font-family: sans-serif !important; }</style><script defer="defer" src="https://wn7lso8ghdka.stremio.com/hisense/1.10.0/runtime.js"></script><script defer="defer" src="video.chunk.js"></script><script defer="defer" src="player.chunk.js"></script><script defer="defer" src="search.chunk.js"></script><script defer="defer" src="main.js"></script><script defer="defer" src="https://wn7lso8ghdka.stremio.com/hisense/1.10.0/service.js"></script><script defer="defer" src="https://wn7lso8ghdka.stremio.com/hisense/1.10.0/webOSTV.js"></script></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id="root"></div></body><script>setTimeout(function(){window.screen720p=false;try{if(Hisense_GetFirmWareVersion()&&window.innerHeight===720){window.screen720p=true}}catch(e){}if(window.screen720p){document.body.style.zoom='65%'}});</script></html>
`;
}

async function main() {
  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(path.join(targetDir, 'index.html'), indexHtml());
  await fs.writeFile(path.join(targetDir, 'main.js'), patchMain(await download('main.js')));
  await fs.writeFile(path.join(targetDir, 'search.chunk.js'), patchSearch(await download('search.chunk.js')));
  await fs.writeFile(path.join(targetDir, 'player.chunk.js'), patchPlayer(await download('player.chunk.js')));
  await fs.writeFile(path.join(targetDir, 'video.chunk.js'), patchVideo(await download('video.chunk.js')));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
