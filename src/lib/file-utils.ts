export type FileCategory = 'text' | 'image' | 'audio' | 'video' | 'unsupported'

export interface FileTypeInfo {
  category: FileCategory
  languageName: string | null
  monacoLanguage: string | null
  displayName: string
}

// Extension to language mapping (based on GitHub Linguist data)
// Format: extension -> [displayName, monacoLanguage]
const EXTENSION_MAP: Record<string, [string, string]> = {
  // JavaScript/TypeScript
  js: ['JavaScript', 'javascript'],
  mjs: ['JavaScript', 'javascript'],
  cjs: ['JavaScript', 'javascript'],
  jsx: ['JavaScript JSX', 'javascript'],
  ts: ['TypeScript', 'typescript'],
  mts: ['TypeScript', 'typescript'],
  cts: ['TypeScript', 'typescript'],
  tsx: ['TypeScript JSX', 'typescript'],

  // Web
  html: ['HTML', 'html'],
  htm: ['HTML', 'html'],
  xhtml: ['HTML', 'html'],
  css: ['CSS', 'css'],
  scss: ['SCSS', 'scss'],
  sass: ['Sass', 'scss'],
  less: ['Less', 'less'],
  vue: ['Vue', 'html'],
  svelte: ['Svelte', 'html'],
  astro: ['Astro', 'html'],

  // Data formats
  json: ['JSON', 'json'],
  jsonc: ['JSON with Comments', 'json'],
  json5: ['JSON5', 'json'],
  yaml: ['YAML', 'yaml'],
  yml: ['YAML', 'yaml'],
  toml: ['TOML', 'ini'],
  xml: ['XML', 'xml'],
  xsd: ['XML Schema', 'xml'],
  xsl: ['XSLT', 'xml'],
  xslt: ['XSLT', 'xml'],
  csv: ['CSV', 'plaintext'],

  // Markdown/Documentation
  md: ['Markdown', 'markdown'],
  mdx: ['MDX', 'mdx'],
  markdown: ['Markdown', 'markdown'],
  rst: ['reStructuredText', 'restructuredtext'],
  txt: ['Plain Text', 'plaintext'],
  text: ['Plain Text', 'plaintext'],

  // Python
  py: ['Python', 'python'],
  pyw: ['Python', 'python'],
  pyi: ['Python Stub', 'python'],
  pyx: ['Cython', 'python'],
  ipynb: ['Jupyter Notebook', 'json'],

  // Ruby
  rb: ['Ruby', 'ruby'],
  rbw: ['Ruby', 'ruby'],
  rake: ['Ruby', 'ruby'],
  gemspec: ['Ruby', 'ruby'],
  ru: ['Ruby', 'ruby'],
  erb: ['ERB', 'html'],

  // Java/JVM
  java: ['Java', 'java'],
  kt: ['Kotlin', 'kotlin'],
  kts: ['Kotlin Script', 'kotlin'],
  scala: ['Scala', 'scala'],
  sc: ['Scala', 'scala'],
  groovy: ['Groovy', 'plaintext'],
  gradle: ['Gradle', 'plaintext'],
  clj: ['Clojure', 'clojure'],
  cljs: ['ClojureScript', 'clojure'],
  cljc: ['Clojure', 'clojure'],
  edn: ['EDN', 'clojure'],

  // C/C++
  c: ['C', 'c'],
  h: ['C Header', 'c'],
  cpp: ['C++', 'cpp'],
  cc: ['C++', 'cpp'],
  cxx: ['C++', 'cpp'],
  hpp: ['C++ Header', 'cpp'],
  hh: ['C++ Header', 'cpp'],
  hxx: ['C++ Header', 'cpp'],
  ino: ['Arduino', 'cpp'],

  // C#/F#/.NET
  cs: ['C#', 'csharp'],
  csx: ['C# Script', 'csharp'],
  fs: ['F#', 'fsharp'],
  fsx: ['F# Script', 'fsharp'],
  fsi: ['F# Signature', 'fsharp'],
  vb: ['Visual Basic', 'vb'],

  // Go
  go: ['Go', 'go'],
  mod: ['Go Module', 'go'],
  sum: ['Go Sum', 'plaintext'],

  // Rust
  rs: ['Rust', 'rust'],

  // Swift/Objective-C
  swift: ['Swift', 'swift'],
  m: ['Objective-C', 'objective-c'],
  mm: ['Objective-C++', 'objective-c'],

  // PHP
  php: ['PHP', 'php'],
  phtml: ['PHP', 'php'],
  php3: ['PHP', 'php'],
  php4: ['PHP', 'php'],
  php5: ['PHP', 'php'],
  phps: ['PHP', 'php'],

  // Shell
  sh: ['Shell', 'shell'],
  bash: ['Bash', 'shell'],
  zsh: ['Zsh', 'shell'],
  fish: ['Fish', 'shell'],
  ps1: ['PowerShell', 'powershell'],
  psm1: ['PowerShell', 'powershell'],
  psd1: ['PowerShell', 'powershell'],
  bat: ['Batch', 'bat'],
  cmd: ['Batch', 'bat'],

  // Database
  sql: ['SQL', 'sql'],
  mysql: ['MySQL', 'mysql'],
  pgsql: ['PostgreSQL', 'pgsql'],
  plsql: ['PL/SQL', 'sql'],

  // Elixir/Erlang
  ex: ['Elixir', 'elixir'],
  exs: ['Elixir', 'elixir'],
  eex: ['EEx', 'elixir'],
  heex: ['HEEx', 'elixir'],
  erl: ['Erlang', 'plaintext'],
  hrl: ['Erlang', 'plaintext'],

  // Haskell
  hs: ['Haskell', 'plaintext'],
  lhs: ['Literate Haskell', 'plaintext'],

  // Lua
  lua: ['Lua', 'lua'],

  // Perl
  pl: ['Perl', 'perl'],
  pm: ['Perl', 'perl'],
  pod: ['Perl POD', 'perl'],

  // R
  r: ['R', 'r'],
  rmd: ['R Markdown', 'markdown'],

  // Julia
  jl: ['Julia', 'julia'],

  // Dart
  dart: ['Dart', 'dart'],

  // Config files
  ini: ['INI', 'ini'],
  cfg: ['Config', 'ini'],
  conf: ['Config', 'ini'],
  config: ['Config', 'xml'],
  env: ['Environment', 'plaintext'],
  properties: ['Properties', 'ini'],

  // Docker/Container
  dockerfile: ['Dockerfile', 'dockerfile'],

  // Infrastructure
  tf: ['Terraform', 'hcl'],
  tfvars: ['Terraform Variables', 'hcl'],
  hcl: ['HCL', 'hcl'],

  // GraphQL
  graphql: ['GraphQL', 'graphql'],
  gql: ['GraphQL', 'graphql'],

  // Protocol Buffers
  proto: ['Protocol Buffer', 'protobuf'],

  // Misc
  lock: ['Lock File', 'json'],
  log: ['Log', 'plaintext'],
  diff: ['Diff', 'plaintext'],
  patch: ['Patch', 'plaintext'],
  gitignore: ['Ignore List', 'shell'],

  // Handlebars/Mustache
  hbs: ['Handlebars', 'handlebars'],
  handlebars: ['Handlebars', 'handlebars'],
  mustache: ['Mustache', 'handlebars'],

  // Pug/Jade
  pug: ['Pug', 'pug'],
  jade: ['Jade', 'pug'],

  // Twig
  twig: ['Twig', 'twig'],

  // Solidity
  sol: ['Solidity', 'solidity'],

  // Assembly
  asm: ['Assembly', 'plaintext'],
  s: ['Assembly', 'plaintext'],

  // Makefile (handled via filename)
  mk: ['Makefile', 'plaintext'],

  // Zig
  zig: ['Zig', 'plaintext'],

  // Nim
  nim: ['Nim', 'plaintext'],

  // Crystal
  cr: ['Crystal', 'ruby'],

  // OCaml
  ml: ['OCaml', 'plaintext'],
  mli: ['OCaml', 'plaintext'],

  // ReScript
  res: ['ReScript', 'plaintext'],
  resi: ['ReScript', 'plaintext'],
}

// Special filenames that map to languages
const FILENAME_MAP: Record<string, [string, string]> = {
  // Docker
  dockerfile: ['Dockerfile', 'dockerfile'],
  'dockerfile.dev': ['Dockerfile', 'dockerfile'],
  'dockerfile.prod': ['Dockerfile', 'dockerfile'],
  'dockerfile.local': ['Dockerfile', 'dockerfile'],
  'dockerfile.test': ['Dockerfile', 'dockerfile'],
  '.dockerignore': ['Ignore List', 'shell'],

  // Make/Build
  makefile: ['Makefile', 'plaintext'],
  gnumakefile: ['Makefile', 'plaintext'],
  cmakelists: ['CMake', 'plaintext'],
  'cmakelists.txt': ['CMake', 'plaintext'],

  // Ruby
  rakefile: ['Ruby', 'ruby'],
  gemfile: ['Ruby', 'ruby'],
  guardfile: ['Ruby', 'ruby'],
  podfile: ['Ruby', 'ruby'],
  vagrantfile: ['Ruby', 'ruby'],
  berksfile: ['Ruby', 'ruby'],
  brewfile: ['Ruby', 'ruby'],
  fastfile: ['Ruby', 'ruby'],
  appfile: ['Ruby', 'ruby'],
  matchfile: ['Ruby', 'ruby'],
  pluginfile: ['Ruby', 'ruby'],
  scanfile: ['Ruby', 'ruby'],
  snapfile: ['Ruby', 'ruby'],
  procfile: ['Procfile', 'yaml'],

  // Ignore files (from linguist)
  '.atomignore': ['Ignore List', 'shell'],
  '.babelignore': ['Ignore List', 'shell'],
  '.bzrignore': ['Ignore List', 'shell'],
  '.coffeelintignore': ['Ignore List', 'shell'],
  '.cvsignore': ['Ignore List', 'shell'],
  '.easignore': ['Ignore List', 'shell'],
  '.eleventyignore': ['Ignore List', 'shell'],
  '.eslintignore': ['Ignore List', 'shell'],
  '.gitignore': ['Ignore List', 'shell'],
  '.ignore': ['Ignore List', 'shell'],
  '.markdownlintignore': ['Ignore List', 'shell'],
  '.nodemonignore': ['Ignore List', 'shell'],
  '.npmignore': ['Ignore List', 'shell'],
  '.prettierignore': ['Ignore List', 'shell'],
  '.stylelintignore': ['Ignore List', 'shell'],
  '.vercelignore': ['Ignore List', 'shell'],
  '.vscodeignore': ['Ignore List', 'shell'],
  'gitignore-global': ['Ignore List', 'shell'],
  gitignore_global: ['Ignore List', 'shell'],

  // Git
  '.gitattributes': ['Git Attributes', 'shell'],
  '.gitmodules': ['Git Modules', 'ini'],

  // Editor/IDE config
  '.editorconfig': ['EditorConfig', 'ini'],

  // JS/TS tooling config
  '.prettierrc': ['Prettier Config', 'json'],
  '.eslintrc': ['ESLint Config', 'json'],
  '.babelrc': ['Babel Config', 'json'],
  '.swcrc': ['SWC Config', 'json'],

  // Package managers
  '.npmrc': ['NPM Config', 'ini'],
  '.yarnrc': ['Yarn Config', 'yaml'],
  '.yarnrc.yml': ['Yarn Config', 'yaml'],
  '.nvmrc': ['NVM Config', 'plaintext'],
  '.node-version': ['Node Version', 'plaintext'],
  '.ruby-version': ['Ruby Version', 'plaintext'],
  '.python-version': ['Python Version', 'plaintext'],
  '.tool-versions': ['asdf Config', 'plaintext'],

  // Environment
  '.env': ['Environment', 'shell'],
  '.env.local': ['Environment', 'shell'],
  '.env.development': ['Environment', 'shell'],
  '.env.production': ['Environment', 'shell'],
  '.env.test': ['Environment', 'shell'],
  '.env.example': ['Environment', 'shell'],
  '.env.sample': ['Environment', 'shell'],
  '.env.template': ['Environment', 'shell'],
  'tsconfig.json': ['TypeScript Config', 'json'],
  'jsconfig.json': ['JavaScript Config', 'json'],
  'package.json': ['NPM Package', 'json'],
  'package-lock.json': ['NPM Lock', 'json'],
  'yarn.lock': ['Yarn Lock', 'plaintext'],
  'pnpm-lock.yaml': ['PNPM Lock', 'yaml'],
  'bun.lockb': ['Bun Lock', 'plaintext'],
  'composer.json': ['Composer', 'json'],
  'composer.lock': ['Composer Lock', 'json'],
  'cargo.toml': ['Cargo', 'ini'],
  'cargo.lock': ['Cargo Lock', 'ini'],
  'go.mod': ['Go Module', 'go'],
  'go.sum': ['Go Sum', 'plaintext'],
  'requirements.txt': ['Python Requirements', 'plaintext'],
  pipfile: ['Pipfile', 'ini'],
  'pipfile.lock': ['Pipfile Lock', 'json'],
  'pyproject.toml': ['Python Project', 'ini'],
  'setup.py': ['Python Setup', 'python'],
  'setup.cfg': ['Python Setup', 'ini'],
  license: ['License', 'plaintext'],
  'license.md': ['License', 'markdown'],
  'license.txt': ['License', 'plaintext'],
  readme: ['README', 'plaintext'],
  'readme.md': ['README', 'markdown'],
  'readme.txt': ['README', 'plaintext'],
  changelog: ['Changelog', 'plaintext'],
  'changelog.md': ['Changelog', 'markdown'],
  contributing: ['Contributing', 'plaintext'],
  'contributing.md': ['Contributing', 'markdown'],
}

// Media file extensions
const IMAGE_EXTENSIONS = new Set([
  'png',
  'jpg',
  'jpeg',
  'gif',
  'bmp',
  'webp',
  'svg',
  'ico',
  'tiff',
  'tif',
  'avif',
  'heic',
  'heif',
  'raw',
  'cr2',
  'nef',
  'arw',
  'dng',
  'psd',
  'ai',
  'eps',
])

const AUDIO_EXTENSIONS = new Set([
  'mp3',
  'wav',
  'ogg',
  'flac',
  'aac',
  'm4a',
  'wma',
  'opus',
  'aiff',
  'aif',
  'mid',
  'midi',
  'ape',
  'alac',
  'pcm',
  'dsd',
  'dsf',
])

const VIDEO_EXTENSIONS = new Set([
  'mp4',
  'webm',
  'mov',
  'avi',
  'mkv',
  'flv',
  'wmv',
  'm4v',
  'mpeg',
  'mpg',
  '3gp',
  'ogv',
  'ts',
  'mts',
  'm2ts',
  'vob',
  'divx',
  'xvid',
  'rm',
  'rmvb',
])

function getExtension(path: string): string | null {
  const parts = path.split('/')
  const filename = parts[parts.length - 1]

  const dotIndex = filename.lastIndexOf('.')
  if (dotIndex === -1 || dotIndex === 0 || dotIndex === filename.length - 1)
    return null

  return filename.slice(dotIndex + 1).toLowerCase()
}

function getFilename(path: string): string {
  const parts = path.split('/')
  return parts[parts.length - 1].toLowerCase()
}

function getFilenameWithoutExtension(path: string): string {
  const filename = getFilename(path)
  const dotIndex = filename.lastIndexOf('.')
  if (dotIndex === -1 || dotIndex === 0) return filename
  return filename.slice(0, dotIndex)
}

export function getFileTypeInfo(path: string): FileTypeInfo {
  const ext = getExtension(path)
  const filename = getFilename(path)
  const filenameNoExt = getFilenameWithoutExtension(path)

  // Check for media files first (by extension)
  if (ext) {
    if (IMAGE_EXTENSIONS.has(ext)) {
      return {
        category: 'image',
        languageName: null,
        monacoLanguage: null,
        displayName: 'Image',
      }
    }
    if (AUDIO_EXTENSIONS.has(ext)) {
      return {
        category: 'audio',
        languageName: null,
        monacoLanguage: null,
        displayName: 'Audio',
      }
    }
    if (VIDEO_EXTENSIONS.has(ext)) {
      return {
        category: 'video',
        languageName: null,
        monacoLanguage: null,
        displayName: 'Video',
      }
    }
  }

  // Check by full filename first (e.g., package.json, Dockerfile)
  if (filename in FILENAME_MAP) {
    const [displayName, monacoLanguage] = FILENAME_MAP[filename]
    return {
      category: 'text',
      languageName: displayName,
      monacoLanguage,
      displayName,
    }
  }

  // Check by filename without extension (e.g., Makefile, Dockerfile)
  if (filenameNoExt in FILENAME_MAP) {
    const [displayName, monacoLanguage] = FILENAME_MAP[filenameNoExt]
    return {
      category: 'text',
      languageName: displayName,
      monacoLanguage,
      displayName,
    }
  }

  // Check by extension
  if (ext && ext in EXTENSION_MAP) {
    const [displayName, monacoLanguage] = EXTENSION_MAP[ext]
    return {
      category: 'text',
      languageName: displayName,
      monacoLanguage,
      displayName,
    }
  }

  // Unknown file type
  return {
    category: 'unsupported',
    languageName: null,
    monacoLanguage: null,
    displayName: 'Unknown',
  }
}

export function isTextFile(path: string): boolean {
  return getFileTypeInfo(path).category === 'text'
}

export function getMonacoLanguage(path: string): string {
  const info = getFileTypeInfo(path)
  return info.monacoLanguage || 'plaintext'
}

export function getFileDisplayName(path: string): string {
  return getFileTypeInfo(path).displayName
}
