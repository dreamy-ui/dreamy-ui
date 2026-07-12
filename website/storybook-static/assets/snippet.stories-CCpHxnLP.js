import{c as e,i as t}from"./preload-helper-CCSz8wUY.js";import{t as n}from"./react-DaLZQZrY.js";import{I as r,L as i,Mr as a,P as o,R as s,ei as c,t as l}from"./iframe-22HWPPlw.js";function u(){return(0,h.jsxs)(s,{w:`full`,children:[(0,h.jsx)(i,{}),(0,h.jsx)(r,{children:`pnpm dlx dreamy add --all`})]})}function d(){let[e,t]=(0,m.useState)(`pnpm`),n={npm:`npx dreamy init`,pnpm:`pnpm dlx dreamy init`,yarn:`yarn dlx dreamy init`,bun:`bunx dreamy init`};return(0,h.jsxs)(s,{w:`full`,children:[(0,h.jsx)(i,{children:[`npm`,`pnpm`,`yarn`,`bun`].map(n=>(0,h.jsx)(a,{color:e===n?`fg`:`fg.medium`,fontWeight:`medium`,onClick:()=>t(n),px:2,py:1,size:`sm`,variant:`link`,children:n},n))}),(0,h.jsx)(r,{codeString:n[e],children:n[e]})]})}function f(){return(0,h.jsxs)(o,{w:`full`,children:[(0,h.jsxs)(s,{size:`sm`,w:`full`,children:[(0,h.jsx)(i,{}),(0,h.jsx)(r,{children:`pnpm dlx dreamy add --all`})]}),(0,h.jsxs)(s,{size:`md`,w:`full`,children:[(0,h.jsx)(i,{}),(0,h.jsx)(r,{children:`pnpm dlx dreamy add --all`})]}),(0,h.jsxs)(s,{size:`lg`,w:`full`,children:[(0,h.jsx)(i,{}),(0,h.jsx)(r,{children:`pnpm dlx dreamy add --all`})]})]})}function p(){return(0,h.jsxs)(s,{w:`full`,children:[(0,h.jsx)(i,{hideCopyButton:!0}),(0,h.jsx)(r,{children:`pnpm dlx dreamy add --all`})]})}var m,h,g,_;t((()=>{l(),m=e(n(),1),h=c(),g={title:`Snippet`},u.__docgenInfo={description:``,methods:[],displayName:`Base`},d.__docgenInfo={description:``,methods:[],displayName:`HeaderChildren`},f.__docgenInfo={description:``,methods:[],displayName:`Sizes`},p.__docgenInfo={description:``,methods:[],displayName:`HideCopyButton`},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`function Base() {
  return <Snippet.Root w="full">
            <Snippet.Header />
            <Snippet.Body>pnpm dlx dreamy add --all</Snippet.Body>
        </Snippet.Root>;
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`function HeaderChildren() {
  const [pm, setPm] = useState<"npm" | "pnpm" | "yarn" | "bun">("pnpm");
  const commands = {
    npm: "npx dreamy init",
    pnpm: "pnpm dlx dreamy init",
    yarn: "yarn dlx dreamy init",
    bun: "bunx dreamy init"
  };
  return <Snippet.Root w="full">
            <Snippet.Header>
                {(["npm", "pnpm", "yarn", "bun"] as const).map(name => <Button color={pm === name ? "fg" : "fg.medium"} fontWeight={"medium"} key={name} onClick={() => setPm(name)} px={2} py={1} size={"sm"} variant={"link"}>
                        {name}
                    </Button>)}
            </Snippet.Header>
            <Snippet.Body codeString={commands[pm]}>{commands[pm]}</Snippet.Body>
        </Snippet.Root>;
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`function Sizes() {
  return <VStack w="full">
            <Snippet.Root size="sm" w="full">
                <Snippet.Header />
                <Snippet.Body>pnpm dlx dreamy add --all</Snippet.Body>
            </Snippet.Root>
            <Snippet.Root size="md" w="full">
                <Snippet.Header />
                <Snippet.Body>pnpm dlx dreamy add --all</Snippet.Body>
            </Snippet.Root>
            <Snippet.Root size="lg" w="full">
                <Snippet.Header />
                <Snippet.Body>pnpm dlx dreamy add --all</Snippet.Body>
            </Snippet.Root>
        </VStack>;
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`function HideCopyButton() {
  return <Snippet.Root w="full">
            <Snippet.Header hideCopyButton />
            <Snippet.Body>pnpm dlx dreamy add --all</Snippet.Body>
        </Snippet.Root>;
}`,...p.parameters?.docs?.source}}},_=[`Base`,`HeaderChildren`,`Sizes`,`HideCopyButton`]}))();export{u as Base,d as HeaderChildren,p as HideCopyButton,f as Sizes,_ as __namedExportsOrder,g as default};