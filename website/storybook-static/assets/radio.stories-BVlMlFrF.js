import{c as e,i as t}from"./preload-helper-CCSz8wUY.js";import{t as n}from"./react-DaLZQZrY.js";import{Sr as r,at as i,ei as a,it as o,t as s}from"./iframe-22HWPPlw.js";function c(){return(0,m.jsx)(o,{defaultChecked:!0,children:`Default`})}function l(){return(0,m.jsxs)(i,{defaultValue:1,children:[(0,m.jsx)(o,{value:1,children:`First`}),(0,m.jsx)(o,{value:2,children:`Second`})]})}function u(){return(0,m.jsxs)(i,{defaultValue:`primary`,children:[(0,m.jsx)(o,{scheme:`primary`,value:`primary`,children:`Primary`}),(0,m.jsx)(o,{scheme:`secondary`,value:`secondary`,children:`Secondary`}),(0,m.jsx)(o,{scheme:`success`,value:`success`,children:`Success`}),(0,m.jsx)(o,{scheme:`warning`,value:`warning`,children:`Warning`}),(0,m.jsx)(o,{scheme:`error`,value:`error`,children:`Error`}),(0,m.jsx)(o,{scheme:`info`,value:`info`,children:`Info`}),(0,m.jsx)(o,{scheme:`none`,value:`none`,children:`None`})]})}function d(){return(0,m.jsxs)(i,{defaultValue:`md`,children:[(0,m.jsx)(o,{size:`sm`,value:`sm`,children:`Small`}),(0,m.jsx)(o,{size:`md`,value:`md`,children:`Medium`}),(0,m.jsx)(o,{size:`lg`,value:`lg`,children:`Large`})]})}function f(){let[e,t]=(0,p.useState)(`rr`);return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)(r,{children:[`Selected: `,e]}),(0,m.jsxs)(i,{onChange:t,value:e,children:[(0,m.jsx)(o,{value:`rr`,children:`React Router`}),(0,m.jsx)(o,{value:`next`,children:`Next.js`}),(0,m.jsx)(o,{value:`vue`,children:`Vue.js`})]})]})}var p,m,h,g;t((()=>{s(),p=e(n(),1),m=a(),h={title:`Radio`},c.__docgenInfo={description:``,methods:[],displayName:`Base`},l.__docgenInfo={description:``,methods:[],displayName:`RadioGroup_`},u.__docgenInfo={description:``,methods:[],displayName:`Scheme`},d.__docgenInfo={description:``,methods:[],displayName:`Size`},f.__docgenInfo={description:``,methods:[],displayName:`Controlled`},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`function Base() {
  return <Radio defaultChecked>Default</Radio>;
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`function RadioGroup_() {
  return <RadioGroup defaultValue={1}>
            <Radio value={1}>First</Radio>
            <Radio value={2}>Second</Radio>
        </RadioGroup>;
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`function Scheme() {
  return <RadioGroup defaultValue="primary">
            <Radio scheme="primary" value="primary">
                Primary
            </Radio>
            <Radio scheme="secondary" value="secondary">
                Secondary
            </Radio>
            <Radio scheme="success" value="success">
                Success
            </Radio>
            <Radio scheme="warning" value="warning">
                Warning
            </Radio>
            <Radio scheme="error" value="error">
                Error
            </Radio>
            <Radio scheme="info" value="info">
                Info
            </Radio>
            <Radio scheme="none" value="none">
                None
            </Radio>
        </RadioGroup>;
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`function Size() {
  return <RadioGroup defaultValue="md">
            <Radio size="sm" value="sm">
                Small
            </Radio>
            <Radio size="md" value="md">
                Medium
            </Radio>
            <Radio size="lg" value="lg">
                Large
            </Radio>
        </RadioGroup>;
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`function Controlled() {
  const [value, setValue] = useState<string | number>("rr");
  return <>
            <Text>Selected: {value}</Text>
            <RadioGroup onChange={setValue} value={value}>
                <Radio value="rr">React Router</Radio>
                <Radio value="next">Next.js</Radio>
                <Radio value="vue">Vue.js</Radio>
            </RadioGroup>
        </>;
}`,...f.parameters?.docs?.source}}},g=[`Base`,`RadioGroup_`,`Scheme`,`Size`,`Controlled`]}))();export{c as Base,f as Controlled,l as RadioGroup_,u as Scheme,d as Size,g as __namedExportsOrder,h as default};