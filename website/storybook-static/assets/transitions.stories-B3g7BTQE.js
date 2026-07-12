import{c as e,i as t}from"./preload-helper-CCSz8wUY.js";import{t as n}from"./react-DaLZQZrY.js";import{Hr as r,Mr as i,P as a,Sr as o,Vr as s,Wr as c,ei as l,t as u}from"./iframe-22HWPPlw.js";function d(){let[e,t]=(0,v.useState)(!1);return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(i,{onClick:()=>t(!e),w:`min-content`,children:`Toggle`}),(0,y.jsx)(s,{in:e,w:`full`,children:(0,y.jsx)(c,{bg:`fg`,color:`bg`,p:4,rounded:`md`,w:`full`,children:`Hello`})})]})}function f(){let[e,t]=(0,v.useState)(!1);return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(i,{onClick:()=>t(!e),w:`min-content`,children:`Toggle`}),(0,y.jsx)(r,{in:e,w:`full`,children:(0,y.jsx)(c,{bg:`fg`,color:`bg`,p:4,rounded:`md`,w:`full`,children:`Hello`})})]})}function p(){let[e,t]=(0,v.useState)(!1);return(0,y.jsxs)(a,{alignItems:`flex-start`,gap:2,w:`full`,children:[(0,y.jsx)(s,{animateOpacity:!1,endingHeight:`auto`,isOpen:e,startingHeight:`4.5em`,w:`full`,children:(0,y.jsx)(o,{children:x})}),(0,y.jsx)(i,{alignSelf:`flex-start`,color:`primary`,onClick:()=>t(!e),variant:`link`,whiteSpace:`nowrap`,children:e?`Show less`:`Show more`})]})}function m(){let[e,t]=(0,v.useState)(!1);return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(i,{onClick:()=>t(!e),w:`min-content`,children:`Toggle`}),(0,y.jsx)(s,{endingHeight:80,in:e,startingHeight:10,w:`full`,children:(0,y.jsx)(c,{bg:`fg`,color:`bg`,p:4,rounded:`md`,w:`full`,children:`Hello`})})]})}function h(){let[e,t]=(0,v.useState)(!1);return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(i,{onClick:()=>t(!e),w:`min-content`,children:`Toggle`}),(0,y.jsx)(s,{animateOpacity:!1,in:e,w:`full`,children:(0,y.jsx)(c,{bg:`fg`,color:`bg`,p:4,rounded:`md`,w:`full`,children:`Hello`})})]})}function g(){let[e,t]=(0,v.useState)(!1);return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(i,{onClick:()=>t(!e),w:`min-content`,children:`Toggle`}),(0,y.jsx)(s,{in:e,unmountOnExit:!0,w:`full`,children:(0,y.jsx)(c,{bg:`fg`,color:`bg`,p:4,rounded:`md`,w:`full`,children:`Hello`})})]})}function _(){let[e,t]=(0,v.useState)(!1);return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(i,{onClick:()=>t(!e),w:`min-content`,children:`Toggle`}),(0,y.jsx)(r,{in:e,initialScale:0,w:`full`,children:(0,y.jsx)(c,{bg:`fg`,color:`bg`,p:4,rounded:`md`,w:`full`,children:`Hello`})})]})}var v,y,b,x,S;t((()=>{u(),v=e(n(),1),y=l(),b={title:`Transitions`},x=`Dreamy UI is a modern React component library built for accessible, themeable interfaces. It pairs headless hooks with Panda CSS recipes so you can compose buttons, overlays, forms, and layout primitives without fighting your design system. Transitions like Collapse make it easy to reveal long copy, FAQ answers, or descriptions without a jarring layout shift. Each component is designed to be copied into your project, customized with tokens, and extended with the same patterns you see in the docs. Whether you are building a marketing page, a dashboard, or a complex form flow, Dreamy UI gives you polished defaults with room to adapt every detail.`,d.__docgenInfo={description:``,methods:[],displayName:`CollapseBasic`},f.__docgenInfo={description:``,methods:[],displayName:`ScaleBasic`},p.__docgenInfo={description:``,methods:[],displayName:`TextCollapse`},m.__docgenInfo={description:``,methods:[],displayName:`CollapseWithHeight`},h.__docgenInfo={description:``,methods:[],displayName:`AnimateOpacity`},g.__docgenInfo={description:``,methods:[],displayName:`UnmountOnExit`},_.__docgenInfo={description:``,methods:[],displayName:`ScaleWithInitialScale`},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`function CollapseBasic() {
  const [isOpen, setIsOpen] = useState(false);
  return <>
            <Button onClick={() => setIsOpen(!isOpen)} w="min-content">
                Toggle
            </Button>
            <Collapse in={isOpen} w="full">
                <Box bg="fg" color="bg" p={4} rounded="md" w="full">
                    Hello
                </Box>
            </Collapse>
        </>;
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`function ScaleBasic() {
  const [isOpen, setIsOpen] = useState(false);
  return <>
            <Button onClick={() => setIsOpen(!isOpen)} w="min-content">
                Toggle
            </Button>
            <Scale in={isOpen} w="full">
                <Box bg="fg" color="bg" p={4} rounded="md" w="full">
                    Hello
                </Box>
            </Scale>
        </>;
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`function TextCollapse() {
  const [isOpen, setIsOpen] = useState(false);
  return <VStack alignItems="flex-start" gap={2} w="full">
            <Collapse animateOpacity={false} endingHeight="auto" isOpen={isOpen} startingHeight="4.5em" w="full">
                <Text>{LONG_TEXT}</Text>
            </Collapse>
            <Button alignSelf="flex-start" color="primary" onClick={() => setIsOpen(!isOpen)} variant="link" whiteSpace="nowrap">
                {isOpen ? "Show less" : "Show more"}
            </Button>
        </VStack>;
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`function CollapseWithHeight() {
  const [isOpen, setIsOpen] = useState(false);
  return <>
            <Button onClick={() => setIsOpen(!isOpen)} w="min-content">
                Toggle
            </Button>
            <Collapse endingHeight={80} in={isOpen} startingHeight={10} w="full">
                <Box bg="fg" color="bg" p={4} rounded="md" w="full">
                    Hello
                </Box>
            </Collapse>
        </>;
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`function AnimateOpacity() {
  const [isOpen, setIsOpen] = useState(false);
  return <>
            <Button onClick={() => setIsOpen(!isOpen)} w="min-content">
                Toggle
            </Button>
            <Collapse animateOpacity={false} in={isOpen} w="full">
                <Box bg="fg" color="bg" p={4} rounded="md" w="full">
                    Hello
                </Box>
            </Collapse>
        </>;
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`function UnmountOnExit() {
  const [isOpen, setIsOpen] = useState(false);
  return <>
            <Button onClick={() => setIsOpen(!isOpen)} w="min-content">
                Toggle
            </Button>
            <Collapse in={isOpen} unmountOnExit w="full">
                <Box bg="fg" color="bg" p={4} rounded="md" w="full">
                    Hello
                </Box>
            </Collapse>
        </>;
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`function ScaleWithInitialScale() {
  const [isOpen, setIsOpen] = useState(false);
  return <>
            <Button onClick={() => setIsOpen(!isOpen)} w="min-content">
                Toggle
            </Button>
            <Scale in={isOpen} initialScale={0} w="full">
                <Box bg="fg" color="bg" p={4} rounded="md" w="full">
                    Hello
                </Box>
            </Scale>
        </>;
}`,..._.parameters?.docs?.source}}},S=[`CollapseBasic`,`ScaleBasic`,`TextCollapse`,`CollapseWithHeight`,`AnimateOpacity`,`UnmountOnExit`,`ScaleWithInitialScale`]}))();export{h as AnimateOpacity,d as CollapseBasic,m as CollapseWithHeight,f as ScaleBasic,_ as ScaleWithInitialScale,p as TextCollapse,g as UnmountOnExit,S as __namedExportsOrder,b as default};