import{c as e,i as t}from"./preload-helper-CCSz8wUY.js";import{t as n}from"./react-DaLZQZrY.js";import{An as r,P as i,Sr as a,ei as o,jn as s,t as c}from"./iframe-22HWPPlw.js";function l(){return(0,g.jsx)(r,{children:`Default`})}function u(){return(0,g.jsxs)(i,{children:[(0,g.jsx)(r,{defaultChecked:!0,scheme:`primary`,children:`Primary`}),(0,g.jsx)(r,{defaultChecked:!0,scheme:`secondary`,children:`Secondary`}),(0,g.jsx)(r,{defaultChecked:!0,scheme:`success`,children:`Success`}),(0,g.jsx)(r,{defaultChecked:!0,scheme:`warning`,children:`Warning`}),(0,g.jsx)(r,{defaultChecked:!0,scheme:`error`,children:`Error`}),(0,g.jsx)(r,{defaultChecked:!0,scheme:`info`,children:`Info`}),(0,g.jsx)(r,{defaultChecked:!0,scheme:`none`,children:`None`})]})}function d(){return(0,g.jsxs)(i,{children:[(0,g.jsx)(r,{variant:`outline`,children:`Outline`}),(0,g.jsx)(r,{variant:`solid`,children:`Solid`})]})}function f(){return(0,g.jsxs)(i,{children:[(0,g.jsx)(r,{size:`sm`,children:`Small`}),(0,g.jsx)(r,{size:`md`,children:`Medium`}),(0,g.jsx)(r,{size:`lg`,children:`Large`})]})}function p(){let[e,t]=(0,h.useState)(!1);return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsxs)(a,{children:[`Selected: `,e?`true`:`false`]}),(0,g.jsx)(r,{isChecked:e,onChangeValue:t,children:`Controlled`})]})}function m(){let[e,t]=(0,h.useState)([`1`]);return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsxs)(a,{children:[`Selected: `,e.join(`, `)]}),(0,g.jsxs)(s,{onChange:t,value:e,children:[(0,g.jsx)(r,{value:`1`,children:`Option 1`}),(0,g.jsx)(r,{value:`2`,children:`Option 2`}),(0,g.jsx)(r,{value:`3`,children:`Option 3`})]})]})}var h,g,_,v;t((()=>{c(),h=e(n(),1),g=o(),_={title:`Checkbox`},l.__docgenInfo={description:``,methods:[],displayName:`Base`},u.__docgenInfo={description:``,methods:[],displayName:`Scheme`},d.__docgenInfo={description:``,methods:[],displayName:`Variant`},f.__docgenInfo={description:``,methods:[],displayName:`Size`},p.__docgenInfo={description:``,methods:[],displayName:`Controlled`},m.__docgenInfo={description:``,methods:[],displayName:`CheckboxGroupControl`},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`function Base() {
  return <Checkbox>Default</Checkbox>;
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`function Scheme() {
  return <VStack>
            <Checkbox defaultChecked scheme="primary">
                Primary
            </Checkbox>
            <Checkbox defaultChecked scheme="secondary">
                Secondary
            </Checkbox>
            <Checkbox defaultChecked scheme="success">
                Success
            </Checkbox>
            <Checkbox defaultChecked scheme="warning">
                Warning
            </Checkbox>
            <Checkbox defaultChecked scheme="error">
                Error
            </Checkbox>
            <Checkbox defaultChecked scheme="info">
                Info
            </Checkbox>
            <Checkbox defaultChecked scheme="none">
                None
            </Checkbox>
        </VStack>;
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`function Variant() {
  return <VStack>
            <Checkbox variant="outline">Outline</Checkbox>
            <Checkbox variant="solid">Solid</Checkbox>
        </VStack>;
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`function Size() {
  return <VStack>
            <Checkbox size="sm">Small</Checkbox>
            <Checkbox size="md">Medium</Checkbox>
            <Checkbox size="lg">Large</Checkbox>
        </VStack>;
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`function Controlled() {
  const [isChecked, setIsChecked] = useState(false);
  return <>
            <Text>Selected: {isChecked ? "true" : "false"}</Text>
            <Checkbox isChecked={isChecked} onChangeValue={setIsChecked}>
                Controlled
            </Checkbox>
        </>;
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`function CheckboxGroupControl() {
  const [value, setValue] = useState<Array<string | number>>(["1"]);
  return <>
            <Text>Selected: {value.join(", ")}</Text>
            <CheckboxGroup onChange={setValue} value={value}>
                <Checkbox value="1">Option 1</Checkbox>
                <Checkbox value="2">Option 2</Checkbox>
                <Checkbox value="3">Option 3</Checkbox>
            </CheckboxGroup>
        </>;
}`,...m.parameters?.docs?.source}}},v=[`Base`,`Scheme`,`Variant`,`Size`,`Controlled`,`CheckboxGroupControl`]}))();export{l as Base,m as CheckboxGroupControl,p as Controlled,u as Scheme,f as Size,d as Variant,v as __namedExportsOrder,_ as default};