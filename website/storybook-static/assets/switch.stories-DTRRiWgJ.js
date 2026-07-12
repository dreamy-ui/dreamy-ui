import{c as e,i as t}from"./preload-helper-CCSz8wUY.js";import{t as n}from"./react-DaLZQZrY.js";import{P as r,S as i,Sr as a,ei as o,t as s}from"./iframe-22HWPPlw.js";function c(){return(0,p.jsx)(i,{children:`Default`})}function l(){return(0,p.jsxs)(r,{children:[(0,p.jsx)(i,{defaultChecked:!0,scheme:`primary`,children:`Primary`}),(0,p.jsx)(i,{defaultChecked:!0,scheme:`secondary`,children:`Secondary`}),(0,p.jsx)(i,{defaultChecked:!0,scheme:`success`,children:`Success`}),(0,p.jsx)(i,{defaultChecked:!0,scheme:`warning`,children:`Warning`}),(0,p.jsx)(i,{defaultChecked:!0,scheme:`error`,children:`Error`}),(0,p.jsx)(i,{defaultChecked:!0,scheme:`info`,children:`Info`}),(0,p.jsx)(i,{defaultChecked:!0,scheme:`none`,children:`None`})]})}function u(){return(0,p.jsxs)(r,{children:[(0,p.jsx)(i,{size:`sm`,children:`Sm`}),(0,p.jsx)(i,{size:`md`,children:`Md`}),(0,p.jsx)(i,{size:`lg`,children:`Lg`})]})}function d(){let[e,t]=(0,f.useState)(!1);return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)(a,{children:[`Selected: `,e?`true`:`false`]}),(0,p.jsx)(i,{isChecked:e,onChangeValue:t,children:`Controlled`})]})}var f,p,m,h;t((()=>{s(),f=e(n(),1),p=o(),m={title:`Switch`},c.__docgenInfo={description:``,methods:[],displayName:`Base`},l.__docgenInfo={description:``,methods:[],displayName:`Scheme`},u.__docgenInfo={description:``,methods:[],displayName:`Size`},d.__docgenInfo={description:``,methods:[],displayName:`Controlled`},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`function Base() {
  return <Switch>Default</Switch>;
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`function Scheme() {
  return <VStack>
            <Switch defaultChecked scheme="primary">
                Primary
            </Switch>
            <Switch defaultChecked scheme="secondary">
                Secondary
            </Switch>
            <Switch defaultChecked scheme="success">
                Success
            </Switch>
            <Switch defaultChecked scheme="warning">
                Warning
            </Switch>
            <Switch defaultChecked scheme="error">
                Error
            </Switch>
            <Switch defaultChecked scheme="info">
                Info
            </Switch>
            <Switch defaultChecked scheme="none">
                None
            </Switch>
        </VStack>;
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`function Size() {
  return <VStack>
            <Switch size="sm">Sm</Switch>
            <Switch size="md">Md</Switch>
            <Switch size="lg">Lg</Switch>
        </VStack>;
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`function Controlled() {
  const [isChecked, setIsChecked] = useState(false);
  return <>
            <Text>Selected: {isChecked ? "true" : "false"}</Text>
            <Switch isChecked={isChecked} onChangeValue={setIsChecked}>
                Controlled
            </Switch>
        </>;
}`,...d.parameters?.docs?.source}}},h=[`Base`,`Scheme`,`Size`,`Controlled`]}))();export{c as Base,d as Controlled,l as Scheme,u as Size,h as __namedExportsOrder,m as default};