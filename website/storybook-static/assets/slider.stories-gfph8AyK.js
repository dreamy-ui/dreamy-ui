import{c as e,i as t}from"./preload-helper-CCSz8wUY.js";import{t as n}from"./react-DaLZQZrY.js";import{B as r,H as i,P as a,Sr as o,U as s,V as c,ei as l,t as u}from"./iframe-22HWPPlw.js";function d(){return(0,x.jsx)(c,{children:(0,x.jsxs)(s,{maxW:`xs`,children:[(0,x.jsx)(r,{}),(0,x.jsx)(i,{})]})})}function f(){let[e,t]=(0,b.useState)(0);return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(o,{children:[`Slider value: `,e]}),(0,x.jsx)(c,{max:50,min:0,onChangeValue:t,step:10,value:e,children:(0,x.jsxs)(s,{maxW:`xs`,children:[(0,x.jsx)(r,{}),(0,x.jsx)(i,{})]})})]})}function p(){return(0,x.jsxs)(a,{gap:10,w:`full`,children:[(0,x.jsx)(c,{size:`sm`,children:(0,x.jsxs)(s,{maxW:`xs`,children:[(0,x.jsx)(r,{}),(0,x.jsx)(i,{})]})}),(0,x.jsx)(c,{size:`md`,children:(0,x.jsxs)(s,{maxW:`xs`,children:[(0,x.jsx)(r,{}),(0,x.jsx)(i,{})]})}),(0,x.jsx)(c,{size:`lg`,children:(0,x.jsxs)(s,{maxW:`xs`,children:[(0,x.jsx)(r,{}),(0,x.jsx)(i,{})]})})]})}function m(){return(0,x.jsxs)(a,{gap:10,w:`full`,children:[(0,x.jsx)(c,{scheme:`primary`,children:(0,x.jsxs)(s,{maxW:`xs`,children:[(0,x.jsx)(r,{}),(0,x.jsx)(i,{})]})}),(0,x.jsx)(c,{scheme:`secondary`,children:(0,x.jsxs)(s,{maxW:`xs`,children:[(0,x.jsx)(r,{}),(0,x.jsx)(i,{})]})}),(0,x.jsx)(c,{scheme:`info`,children:(0,x.jsxs)(s,{maxW:`xs`,children:[(0,x.jsx)(r,{}),(0,x.jsx)(i,{})]})}),(0,x.jsx)(c,{scheme:`success`,children:(0,x.jsxs)(s,{maxW:`xs`,children:[(0,x.jsx)(r,{}),(0,x.jsx)(i,{})]})}),(0,x.jsx)(c,{scheme:`warning`,children:(0,x.jsxs)(s,{maxW:`xs`,children:[(0,x.jsx)(r,{}),(0,x.jsx)(i,{})]})}),(0,x.jsx)(c,{scheme:`error`,children:(0,x.jsxs)(s,{maxW:`xs`,children:[(0,x.jsx)(r,{}),(0,x.jsx)(i,{})]})})]})}function h(){return(0,x.jsx)(c,{h:`200px`,orientation:`vertical`,children:(0,x.jsxs)(s,{maxW:`xs`,children:[(0,x.jsx)(r,{}),(0,x.jsx)(i,{})]})})}function g(){return(0,x.jsx)(c,{isReversed:!0,children:(0,x.jsxs)(s,{maxW:`xs`,children:[(0,x.jsx)(r,{}),(0,x.jsx)(i,{})]})})}function _(){return(0,x.jsxs)(a,{gap:10,w:`full`,children:[(0,x.jsx)(c,{thumbSize:16,children:(0,x.jsxs)(s,{maxW:`xs`,children:[(0,x.jsx)(r,{}),(0,x.jsx)(i,{})]})}),(0,x.jsx)(c,{thumbSize:32,children:(0,x.jsxs)(s,{maxW:`xs`,children:[(0,x.jsx)(r,{}),(0,x.jsx)(i,{})]})}),(0,x.jsx)(c,{scheme:`info`,thumbSize:48,children:(0,x.jsxs)(s,{maxW:`xs`,children:[(0,x.jsx)(r,{}),(0,x.jsx)(i,{})]})})]})}function v(){return(0,x.jsxs)(a,{gap:10,w:`full`,children:[(0,x.jsx)(c,{hideThumb:!0,children:(0,x.jsx)(s,{maxW:`xs`,children:(0,x.jsx)(r,{})})}),(0,x.jsx)(c,{defaultValue:70,hideThumb:!0,scheme:`success`,children:(0,x.jsx)(s,{maxW:`xs`,children:(0,x.jsx)(r,{})})})]})}function y(){let[e,t]=(0,b.useState)(0);return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(o,{children:[`Slider value: `,e]}),(0,x.jsx)(c,{onChangeValue:t,value:e,children:(0,x.jsxs)(s,{maxW:`xs`,children:[(0,x.jsx)(r,{}),(0,x.jsx)(i,{})]})})]})}var b,x,S,C;t((()=>{u(),b=e(n(),1),x=l(),S={title:`Slider`},d.__docgenInfo={description:``,methods:[],displayName:`Base`},f.__docgenInfo={description:``,methods:[],displayName:`MaxMinStep`},p.__docgenInfo={description:``,methods:[],displayName:`Size`},m.__docgenInfo={description:``,methods:[],displayName:`Scheme`},h.__docgenInfo={description:``,methods:[],displayName:`Orientation`},g.__docgenInfo={description:``,methods:[],displayName:`Reversed`},_.__docgenInfo={description:``,methods:[],displayName:`CustomThumbSize`},v.__docgenInfo={description:``,methods:[],displayName:`HideThumb`},y.__docgenInfo={description:``,methods:[],displayName:`Controlled`},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`function Base() {
  return <Slider.Root>
            <Slider.Track maxW="xs">
                <Slider.FilledTrack />
                <Slider.Thumb />
            </Slider.Track>
        </Slider.Root>;
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`function MaxMinStep() {
  const [value, setValue] = useState(0);
  return <>
            <Text>
                Slider value: {value}
            </Text>

            <Slider.Root max={50} min={0} onChangeValue={setValue} step={10} value={value}>
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        </>;
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`function Size() {
  return <VStack gap={10} w="full">
            <Slider.Root size="sm">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root size="md">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root size="lg">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        </VStack>;
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`function Scheme() {
  return <VStack gap={10} w="full">
            <Slider.Root scheme="primary">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root scheme="secondary">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root scheme="info">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root scheme="success">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root scheme="warning">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root scheme="error">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        </VStack>;
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`function Orientation() {
  return <Slider.Root h="200px" orientation="vertical">
            <Slider.Track maxW="xs">
                <Slider.FilledTrack />
                <Slider.Thumb />
            </Slider.Track>
        </Slider.Root>;
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`function Reversed() {
  return <Slider.Root isReversed>
            <Slider.Track maxW="xs">
                <Slider.FilledTrack />
                <Slider.Thumb />
            </Slider.Track>
        </Slider.Root>;
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`function CustomThumbSize() {
  return <VStack gap={10} w="full">
            <Slider.Root thumbSize={16}>
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root thumbSize={32}>
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root scheme="info" thumbSize={48}>
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        </VStack>;
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`function HideThumb() {
  return <VStack gap={10} w="full">
            <Slider.Root hideThumb>
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                </Slider.Track>
            </Slider.Root>
            <Slider.Root defaultValue={70} hideThumb scheme="success">
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                </Slider.Track>
            </Slider.Root>
        </VStack>;
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`function Controlled() {
  const [value, setValue] = useState(0);
  return <>
            <Text>
                Slider value: {value}
            </Text>

            <Slider.Root onChangeValue={setValue} value={value}>
                <Slider.Track maxW="xs">
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        </>;
}`,...y.parameters?.docs?.source}}},C=[`Base`,`MaxMinStep`,`Size`,`Scheme`,`Orientation`,`Reversed`,`CustomThumbSize`,`HideThumb`,`Controlled`]}))();export{d as Base,y as Controlled,_ as CustomThumbSize,v as HideThumb,f as MaxMinStep,h as Orientation,g as Reversed,m as Scheme,p as Size,C as __namedExportsOrder,S as default};