# rezeptor

This template should help get you started developing with Vue 3 in Vite.

## Windi CSS

### Vue Scoped Styles

> You will need to set `transformCSS: 'pre'` to get Scoped Style work.

https://windicss.org/integrations/vite.html#caveats

### Dynamic classes

Windi CSS does not detect utilities that are not wrapped in quotes!

```html
<!-- ❌ does not work -->
<div :class="{ hidden: isTrue }" />

<!-- ✅ does work -->
<div :class="{ 'hidden': isTrue }" />
```

To prevent Prettier from removing quotes add `"quoteProps": "preserve"` to the config.
