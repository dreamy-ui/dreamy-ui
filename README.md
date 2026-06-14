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

Registry source files live in the root `components/` folder (`ui/`, `recipes/`, `patterns/`).

To transform them into addable JSON files and sync them into `website/components/` (used by the website), run:

```bash
pnpm components:watch
```

This watches the root `components/` folder, writes JSON to `website/public/`, and syncs generated files into `website/components/`.

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
