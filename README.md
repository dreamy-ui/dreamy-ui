<p align="center">
  <a href="https://dreamy-ui.com">
      <img width="50%" src="https://dreamy-ui.com/dreamy-ui-wallpaper.png" alt="dreamy-ui" />
      <h1 align="center">Dreamy UI</h1>
  </a>
</p>

Dreamy is a component library built on top of [Panda CSS](https://panda-css.com/). Build pretty, performant and accessible websites with ease. Works in React Server Components.

## Usage

Please refer to the **[documentation](https://dreamy-ui.com/docs)**.

## Help

Join out [Discord](https://dreamy-ui.com/discord) to get community help.

## Contributing

Contributors are welcome! If you got any questions, please view #contributing channel on our [Discord](https://dreamy-ui.com/discord).

## Running the project

### Build the project for development

```bash
pnpm build:dev
```

### Start the project

```bash
pnpm dev
```

### Editing registry components

Registry components are located in `website/compositions`, where all patterns, recipes and ui components are stored.

To transform them into addable files (json) and add them into website components folder you can run this:

```bash
pnpm components:watch
```

This will listen to any changes under "website/compositions" folder and the changed files into "website/components" folder, which are used by the website to display the components.

### Running Storybook

```bash
pnpm story
```

## Credits

Making Dreamy UI wouldn't be possible without the following libraries:

- [Panda CSS](https://panda-css.com/) - For the amazing CSS-in-JS styling system Dreamy UI relies on.
- [Chakra UI](https://chakra-ui.com/) - Where it all started and for components inspiration.
- [Untitled UI](https://www.untitledui.com/) - For styling inspiration.
- [HeroUI](https://www.heroui.com/) - For components inspiration.

## License

MIT
