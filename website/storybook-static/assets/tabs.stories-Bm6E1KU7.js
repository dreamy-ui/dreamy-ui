import{c as e,i as t}from"./preload-helper-CCSz8wUY.js";import{t as n}from"./react-DaLZQZrY.js";import{Sr as r,Wr as i,c as a,d as o,ei as s,f as c,l,or as u,t as d,u as f}from"./iframe-22HWPPlw.js";function p(){return(0,b.jsxs)(o,{children:[(0,b.jsxs)(a,{children:[(0,b.jsx)(c,{children:`Tab 1`}),(0,b.jsx)(c,{children:`Tab 2`}),(0,b.jsx)(c,{children:`Tab 3`})]}),(0,b.jsxs)(f,{children:[(0,b.jsx)(l,{children:(0,b.jsx)(`p`,{children:`Tab 1`})}),(0,b.jsx)(l,{children:(0,b.jsx)(`p`,{children:`Tab 2`})}),(0,b.jsx)(l,{children:(0,b.jsx)(`p`,{children:`Tab 3`})})]})]})}function m(){return(0,b.jsx)(u,{col:!0,gap:6,children:[`filled`,`underline`,`filled-simple`].map(e=>(0,b.jsxs)(u,{col:!0,gap:2,children:[(0,b.jsxs)(r,{bold:!0,children:[e.charAt(0).toUpperCase()+e.slice(1),` Variant`]}),(0,b.jsxs)(o,{variant:e,children:[(0,b.jsxs)(a,{children:[(0,b.jsx)(c,{children:`Tab 1`}),(0,b.jsx)(c,{children:`Tab 2`}),(0,b.jsx)(c,{children:`Tab 3`})]}),(0,b.jsxs)(f,{children:[(0,b.jsx)(l,{children:(0,b.jsx)(`p`,{children:`Tab 1 content`})}),(0,b.jsx)(l,{children:(0,b.jsx)(`p`,{children:`Tab 2 content`})}),(0,b.jsx)(l,{children:(0,b.jsx)(`p`,{children:`Tab 3 content`})})]})]})]},e))})}function h(){return(0,b.jsxs)(o,{fitted:!0,children:[(0,b.jsxs)(a,{children:[(0,b.jsx)(c,{children:`Tab 1`}),(0,b.jsx)(c,{children:`Tab 2`}),(0,b.jsx)(c,{children:`Tab 3`})]}),(0,b.jsxs)(f,{children:[(0,b.jsx)(l,{children:(0,b.jsx)(`p`,{children:`Tab 1`})}),(0,b.jsx)(l,{children:(0,b.jsx)(`p`,{children:`Tab 2`})}),(0,b.jsx)(l,{children:(0,b.jsx)(`p`,{children:`Tab 3`})})]})]})}function g(){let[e,t]=(0,y.useState)(2);return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)(r,{bold:!0,children:[`Current Tab: `,e+1]}),(0,b.jsxs)(o,{index:e,onChange:t,children:[(0,b.jsxs)(a,{children:[(0,b.jsx)(c,{children:`Tab 1`}),(0,b.jsx)(c,{children:`Tab 2`}),(0,b.jsx)(c,{children:`Tab 3`})]}),(0,b.jsxs)(f,{children:[(0,b.jsx)(l,{children:(0,b.jsx)(`p`,{children:`Tab 1 content`})}),(0,b.jsx)(l,{children:(0,b.jsx)(`p`,{children:`Tab 2 content`})}),(0,b.jsx)(l,{children:(0,b.jsx)(`p`,{children:`Tab 3 content`})})]})]})]})}function _(){return(0,b.jsxs)(o,{isLazy:!0,children:[(0,b.jsxs)(a,{children:[(0,b.jsx)(c,{children:`Tab 1`}),(0,b.jsx)(c,{children:`Tab 2`}),(0,b.jsx)(c,{children:`Tab 3`})]}),(0,b.jsxs)(f,{children:[(0,b.jsx)(l,{children:(0,b.jsx)(`p`,{children:`Tab 1`})}),(0,b.jsx)(l,{children:(0,b.jsx)(`p`,{children:`Tab 2`})}),(0,b.jsx)(l,{children:(0,b.jsx)(`p`,{children:`Tab 3`})})]})]})}function v(){return(0,b.jsx)(i,{maxW:`xs`,w:`xs`,children:(0,b.jsxs)(o,{children:[(0,b.jsxs)(a,{overflowX:`scroll`,children:[(0,b.jsx)(c,{children:`Tab 1`}),(0,b.jsx)(c,{children:`Tab 2`}),(0,b.jsx)(c,{children:`Tab 3`}),(0,b.jsx)(c,{children:`Tab 4`}),(0,b.jsx)(c,{children:`Tab 5`}),(0,b.jsx)(c,{children:`Tab 6`}),(0,b.jsx)(c,{children:`Tab 7`})]}),(0,b.jsxs)(f,{children:[(0,b.jsx)(l,{children:`1`}),(0,b.jsx)(l,{children:`2`}),(0,b.jsx)(l,{children:`3`}),(0,b.jsx)(l,{children:`4`}),(0,b.jsx)(l,{children:`5`}),(0,b.jsx)(l,{children:`6`}),(0,b.jsx)(l,{children:`7`})]})]})})}var y,b,x,S;t((()=>{d(),y=e(n(),1),b=s(),x={title:`Tabs`},p.__docgenInfo={description:``,methods:[],displayName:`Base`},m.__docgenInfo={description:``,methods:[],displayName:`Variants`},h.__docgenInfo={description:``,methods:[],displayName:`Fitted`},g.__docgenInfo={description:``,methods:[],displayName:`Controlled`},_.__docgenInfo={description:``,methods:[],displayName:`LazyMount`},v.__docgenInfo={description:``,methods:[],displayName:`Overflow`},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`function Base() {
  return <Tabs.Root>
            <Tabs.List>
                <Tabs.Tab>Tab 1</Tabs.Tab>
                <Tabs.Tab>Tab 2</Tabs.Tab>
                <Tabs.Tab>Tab 3</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panels>
                <Tabs.Panel>
                    <p>Tab 1</p>
                </Tabs.Panel>
                <Tabs.Panel>
                    <p>Tab 2</p>
                </Tabs.Panel>
                <Tabs.Panel>
                    <p>Tab 3</p>
                </Tabs.Panel>
            </Tabs.Panels>
        </Tabs.Root>;
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`function Variants() {
  return <Flex col gap={6}>
            {(["filled", "underline", "filled-simple"] as const).map(variant => <Flex col gap={2} key={variant}>
                    <Text bold>{variant.charAt(0).toUpperCase() + variant.slice(1)} Variant</Text>
                    <Tabs.Root variant={variant}>
                        <Tabs.List>
                            <Tabs.Tab>Tab 1</Tabs.Tab>
                            <Tabs.Tab>Tab 2</Tabs.Tab>
                            <Tabs.Tab>Tab 3</Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panels>
                            <Tabs.Panel>
                                <p>Tab 1 content</p>
                            </Tabs.Panel>
                            <Tabs.Panel>
                                <p>Tab 2 content</p>
                            </Tabs.Panel>
                            <Tabs.Panel>
                                <p>Tab 3 content</p>
                            </Tabs.Panel>
                        </Tabs.Panels>
                    </Tabs.Root>
                </Flex>)}
        </Flex>;
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`function Fitted() {
  return <Tabs.Root fitted>
            <Tabs.List>
                <Tabs.Tab>Tab 1</Tabs.Tab>
                <Tabs.Tab>Tab 2</Tabs.Tab>
                <Tabs.Tab>Tab 3</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panels>
                <Tabs.Panel>
                    <p>Tab 1</p>
                </Tabs.Panel>
                <Tabs.Panel>
                    <p>Tab 2</p>
                </Tabs.Panel>
                <Tabs.Panel>
                    <p>Tab 3</p>
                </Tabs.Panel>
            </Tabs.Panels>
        </Tabs.Root>;
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`function Controlled() {
  const [index, setIndex] = useState(2);
  return <>
            <Text bold>Current Tab: {index + 1}</Text>

            <Tabs.Root index={index} onChange={setIndex}>
                <Tabs.List>
                    <Tabs.Tab>Tab 1</Tabs.Tab>
                    <Tabs.Tab>Tab 2</Tabs.Tab>
                    <Tabs.Tab>Tab 3</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panels>
                    <Tabs.Panel>
                        <p>Tab 1 content</p>
                    </Tabs.Panel>
                    <Tabs.Panel>
                        <p>Tab 2 content</p>
                    </Tabs.Panel>
                    <Tabs.Panel>
                        <p>Tab 3 content</p>
                    </Tabs.Panel>
                </Tabs.Panels>
            </Tabs.Root>
        </>;
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`function LazyMount() {
  return <Tabs.Root isLazy>
            <Tabs.List>
                <Tabs.Tab>Tab 1</Tabs.Tab>
                <Tabs.Tab>Tab 2</Tabs.Tab>
                <Tabs.Tab>Tab 3</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panels>
                <Tabs.Panel>
                    <p>Tab 1</p>
                </Tabs.Panel>
                <Tabs.Panel>
                    <p>Tab 2</p>
                </Tabs.Panel>
                <Tabs.Panel>
                    <p>Tab 3</p>
                </Tabs.Panel>
            </Tabs.Panels>
        </Tabs.Root>;
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`function Overflow() {
  return <Box maxW="xs" w="xs">
            <Tabs.Root>
                <Tabs.List overflowX="scroll">
                    <Tabs.Tab>Tab 1</Tabs.Tab>
                    <Tabs.Tab>Tab 2</Tabs.Tab>
                    <Tabs.Tab>Tab 3</Tabs.Tab>
                    <Tabs.Tab>Tab 4</Tabs.Tab>
                    <Tabs.Tab>Tab 5</Tabs.Tab>
                    <Tabs.Tab>Tab 6</Tabs.Tab>
                    <Tabs.Tab>Tab 7</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panels>
                    <Tabs.Panel>1</Tabs.Panel>
                    <Tabs.Panel>2</Tabs.Panel>
                    <Tabs.Panel>3</Tabs.Panel>
                    <Tabs.Panel>4</Tabs.Panel>
                    <Tabs.Panel>5</Tabs.Panel>
                    <Tabs.Panel>6</Tabs.Panel>
                    <Tabs.Panel>7</Tabs.Panel>
                </Tabs.Panels>
            </Tabs.Root>
        </Box>;
}`,...v.parameters?.docs?.source}}},S=[`Base`,`Variants`,`Fitted`,`Controlled`,`LazyMount`,`Overflow`]}))();export{p as Base,g as Controlled,h as Fitted,_ as LazyMount,v as Overflow,m as Variants,S as __namedExportsOrder,x as default};