# Custom Markdown Components

Kokoa Blog now supports rendering Vue components directly within your markdown posts! This gives you the ultimate flexibility to use custom UI elements without needing to edit the codebase.

## How it works
The `KokoaMarkdownRenderer` parses standard markdown syntax, but because the Vue Runtime Compiler is enabled, any HTML tag that matches a registered Vue component will be instantiated and rendered dynamically.

## Example Usage

You can seamlessly intermix markdown and custom Kokoa/RekaUI components:

```md
Welcome to my blog post! Here is a custom card element:

<KokoaCard>
  <template #header>
    <div class="kokoa-card__header">My Custom Card</div>
  </template>
  This card is rendered entirely through markdown!
</KokoaCard>

You can also use standard RekaUI components if they are available:
<Dialog>...</Dialog>
```

## Security Note
Because the runtime compiler processes the markdown string directly into Vue templates, be cautious not to allow untrusted users to create posts. As an admin, you can safely use any Vue feature (including bindings, `v-if`, and `v-for`) inside your markdown content.
