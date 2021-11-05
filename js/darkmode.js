(win=>{
  win.saveToLocal = {
    set: function setWithExpiry(key, value, ttl) {
      if (ttl === 0) return
      const now = new Date()
      const expiryDay = ttl * 86400000
      const item = {
        value: value,
        expiry: now.getTime() + expiryDay,
      }
      localStorage.setItem(key, JSON.stringify(item))
    },

    get: function getWithExpiry(key) {
      const itemStr = localStorage.getItem(key)

      if (!itemStr) {
        return undefined
      }
      const item = JSON.parse(itemStr)
      const now = new Date()

      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key)
        return undefined
      }
      return item.value
    }
  }
  win.activateDarkMode = function () {
    document.documentElement.setAttribute('data-theme', 'dark')
    if (document.querySelector('meta[name="theme-color"]') !== null) {
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#0d0d0d')
    }
    Array.from($("img")).forEach(img => {
      let ori = img.src
      if (ori.match(/\/BlogLogo\.png/)) {
        img.src = "/BlogLogo_.png"
      }
    })
    $('#colormode')[0].innerHTML = '<i class="fas fa-sun"></i>'
  }
  win.activateLightMode = function () {
    document.documentElement.setAttribute('data-theme', 'light')
    if (document.querySelector('meta[name="theme-color"]') !== null) {
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#ffffff')
    }
    Array.from($("img")).forEach(img => {
      let ori = img.src
      if (ori.match(/\/BlogLogo_\.png/)) {
        img.src = "/BlogLogo.png"
      }
    })
    $('#colormode')[0].innerHTML = '<i class="fas fa-moon"></i>'
  }
  const t = saveToLocal.get('theme')
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches
  const isNotSpecified = window.matchMedia('(prefers-color-scheme: no-preference)').matches
  const hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified

  if (t === undefined) {
    if (isLightMode) activateLightMode()
    else if (isDarkMode) activateDarkMode()
    else if (isNotSpecified || hasNoSupport) {
      const now = new Date()
      const hour = now.getHours()
      const isNight = hour <= 6 || hour >= 18
      isNight ? activateDarkMode() : activateLightMode()
    }
    window.matchMedia('(prefers-color-scheme: dark)').addListener(function (e) {
      if (saveToLocal.get('theme') === undefined) {
        e.matches ? activateDarkMode() : activateLightMode()
      }
    })
  } else if (t === 'light') activateLightMode()
  else activateDarkMode()
})(window)

function switchColorMode() {
  const mode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
  if (mode === 'light') {
    activateDarkMode()
    saveToLocal.set('theme', 'dark', 2)
  }
  else {
    activateLightMode()
    saveToLocal.set('theme', 'light', 2)
  }
}

$("#colormode")[0].addEventListener("click", switchColorMode)