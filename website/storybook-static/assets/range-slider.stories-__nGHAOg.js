import{c as e,i as t}from"./preload-helper-CCSz8wUY.js";import{t as n}from"./react-DaLZQZrY.js";import{$ as r,P as i,Sr as a,ei as o,et as s,nt as c,t as l,tt as u}from"./iframe-22HWPPlw.js";function d(){return(0,b.jsx)(s,{children:(0,b.jsxs)(c,{maxW:`xs`,children:[(0,b.jsx)(r,{}),(0,b.jsx)(u,{index:0}),(0,b.jsx)(u,{index:1})]})})}function f(){let[e,t]=(0,y.useState)([0,25]);return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)(a,{children:[`Range: `,e[0],` - `,e[1]]}),(0,b.jsx)(s,{max:50,min:0,onChangeValue:t,step:5,value:e,children:(0,b.jsxs)(c,{maxW:`xs`,children:[(0,b.jsx)(r,{}),(0,b.jsx)(u,{index:0}),(0,b.jsx)(u,{index:1})]})})]})}function p(){return(0,b.jsxs)(i,{gap:10,w:`full`,children:[(0,b.jsx)(s,{size:`sm`,children:(0,b.jsxs)(c,{maxW:`xs`,children:[(0,b.jsx)(r,{}),(0,b.jsx)(u,{index:0}),(0,b.jsx)(u,{index:1})]})}),(0,b.jsx)(s,{size:`md`,children:(0,b.jsxs)(c,{maxW:`xs`,children:[(0,b.jsx)(r,{}),(0,b.jsx)(u,{index:0}),(0,b.jsx)(u,{index:1})]})}),(0,b.jsx)(s,{size:`lg`,children:(0,b.jsxs)(c,{maxW:`xs`,children:[(0,b.jsx)(r,{}),(0,b.jsx)(u,{index:0}),(0,b.jsx)(u,{index:1})]})})]})}function m(){return(0,b.jsxs)(i,{gap:10,w:`full`,children:[(0,b.jsx)(s,{scheme:`primary`,children:(0,b.jsxs)(c,{maxW:`xs`,children:[(0,b.jsx)(r,{}),(0,b.jsx)(u,{index:0}),(0,b.jsx)(u,{index:1})]})}),(0,b.jsx)(s,{scheme:`secondary`,children:(0,b.jsxs)(c,{maxW:`xs`,children:[(0,b.jsx)(r,{}),(0,b.jsx)(u,{index:0}),(0,b.jsx)(u,{index:1})]})}),(0,b.jsx)(s,{scheme:`info`,children:(0,b.jsxs)(c,{maxW:`xs`,children:[(0,b.jsx)(r,{}),(0,b.jsx)(u,{index:0}),(0,b.jsx)(u,{index:1})]})}),(0,b.jsx)(s,{scheme:`success`,children:(0,b.jsxs)(c,{maxW:`xs`,children:[(0,b.jsx)(r,{}),(0,b.jsx)(u,{index:0}),(0,b.jsx)(u,{index:1})]})}),(0,b.jsx)(s,{scheme:`warning`,children:(0,b.jsxs)(c,{maxW:`xs`,children:[(0,b.jsx)(r,{}),(0,b.jsx)(u,{index:0}),(0,b.jsx)(u,{index:1})]})}),(0,b.jsx)(s,{scheme:`error`,children:(0,b.jsxs)(c,{maxW:`xs`,children:[(0,b.jsx)(r,{}),(0,b.jsx)(u,{index:0}),(0,b.jsx)(u,{index:1})]})})]})}function h(){return(0,b.jsx)(s,{h:`200px`,orientation:`vertical`,children:(0,b.jsxs)(c,{maxW:`xs`,children:[(0,b.jsx)(r,{}),(0,b.jsx)(u,{index:0}),(0,b.jsx)(u,{index:1})]})})}function g(){return(0,b.jsx)(s,{isReversed:!0,children:(0,b.jsxs)(c,{maxW:`xs`,children:[(0,b.jsx)(r,{}),(0,b.jsx)(u,{index:0}),(0,b.jsx)(u,{index:1})]})})}function _(){return(0,b.jsxs)(i,{gap:10,w:`full`,children:[(0,b.jsx)(s,{thumbSize:16,children:(0,b.jsxs)(c,{maxW:`xs`,children:[(0,b.jsx)(r,{}),(0,b.jsx)(u,{index:0}),(0,b.jsx)(u,{index:1})]})}),(0,b.jsx)(s,{thumbSize:32,children:(0,b.jsxs)(c,{maxW:`xs`,children:[(0,b.jsx)(r,{}),(0,b.jsx)(u,{index:0}),(0,b.jsx)(u,{index:1})]})}),(0,b.jsx)(s,{scheme:`info`,thumbSize:48,children:(0,b.jsxs)(c,{maxW:`xs`,children:[(0,b.jsx)(r,{}),(0,b.jsx)(u,{index:0}),(0,b.jsx)(u,{index:1})]})})]})}function v(){let[e,t]=(0,y.useState)([25,75]);return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)(a,{children:[`Range: `,e[0],` - `,e[1]]}),(0,b.jsx)(s,{onChangeValue:t,value:e,children:(0,b.jsxs)(c,{maxW:`xs`,children:[(0,b.jsx)(r,{}),(0,b.jsx)(u,{index:0}),(0,b.jsx)(u,{index:1})]})})]})}var y,b,x,S;t((()=>{l(),y=e(n(),1),b=o(),x={title:`Range Slider`},d.__docgenInfo={description:``,methods:[],displayName:`Base`},f.__docgenInfo={description:``,methods:[],displayName:`MaxMinStep`},p.__docgenInfo={description:``,methods:[],displayName:`Size`},m.__docgenInfo={description:``,methods:[],displayName:`Scheme`},h.__docgenInfo={description:``,methods:[],displayName:`Orientation`},g.__docgenInfo={description:``,methods:[],displayName:`Reversed`},_.__docgenInfo={description:``,methods:[],displayName:`CustomThumbSize`},v.__docgenInfo={description:``,methods:[],displayName:`Controlled`},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`function Base() {
  return <RangeSlider.Root>
            <RangeSlider.Track maxW="xs">
                <RangeSlider.FilledTrack />
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Track>
        </RangeSlider.Root>;
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`function MaxMinStep() {
  const [value, setValue] = useState<[number, number]>([0, 25]);
  return <>
            <Text>
                Range: {value[0]} - {value[1]}
            </Text>

            <RangeSlider.Root max={50} min={0} onChangeValue={setValue} step={5} value={value}>
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
        </>;
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`function Size() {
  return <VStack gap={10} w="full">
            <RangeSlider.Root size="sm">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root size="md">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root size="lg">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
        </VStack>;
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`function Scheme() {
  return <VStack gap={10} w="full">
            <RangeSlider.Root scheme="primary">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root scheme="secondary">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root scheme="info">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root scheme="success">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root scheme="warning">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root scheme="error">
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
        </VStack>;
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`function Orientation() {
  return <RangeSlider.Root h="200px" orientation="vertical">
            <RangeSlider.Track maxW="xs">
                <RangeSlider.FilledTrack />
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Track>
        </RangeSlider.Root>;
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`function Reversed() {
  return <RangeSlider.Root isReversed>
            <RangeSlider.Track maxW="xs">
                <RangeSlider.FilledTrack />
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Track>
        </RangeSlider.Root>;
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`function CustomThumbSize() {
  return <VStack gap={10} w="full">
            <RangeSlider.Root thumbSize={16}>
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root thumbSize={32}>
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
            <RangeSlider.Root scheme="info" thumbSize={48}>
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
        </VStack>;
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`function Controlled() {
  const [value, setValue] = useState<[number, number]>([25, 75]);
  return <>
            <Text>
                Range: {value[0]} - {value[1]}
            </Text>

            <RangeSlider.Root onChangeValue={setValue} value={value}>
                <RangeSlider.Track maxW="xs">
                    <RangeSlider.FilledTrack />
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Track>
            </RangeSlider.Root>
        </>;
}`,...v.parameters?.docs?.source}}},S=[`Base`,`MaxMinStep`,`Size`,`Scheme`,`Orientation`,`Reversed`,`CustomThumbSize`,`Controlled`]}))();export{d as Base,v as Controlled,_ as CustomThumbSize,f as MaxMinStep,h as Orientation,g as Reversed,m as Scheme,p as Size,S as __namedExportsOrder,x as default};