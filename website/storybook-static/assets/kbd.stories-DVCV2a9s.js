import{i as e}from"./preload-helper-CCSz8wUY.js";import{ei as t,t as n,zt as r}from"./iframe-22HWPPlw.js";import{n as i,t as a}from"./dist-R1h79IYQ.js";function o(){return(0,l.jsx)(r,{children:`^i`})}function s(){return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(r,{size:`sm`,children:`Esc`}),(0,l.jsx)(r,{size:`md`,children:`Enter`}),(0,l.jsx)(r,{size:`lg`,children:`Space`})]})}function c(){return(0,l.jsxs)(r,{children:[i(),` + K`]})}var l,u,d;e((()=>{n(),a(),l=t(),u={title:`Keyboard Key`},o.__docgenInfo={description:``,methods:[],displayName:`Base`},s.__docgenInfo={description:``,methods:[],displayName:`Sizes`},c.__docgenInfo={description:``,methods:[],displayName:`PlatformSpecificKbd`},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`function Base() {
  return <Kbd>^i</Kbd>;
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`function Sizes() {
  return <>
            <Kbd size="sm">Esc</Kbd>
            <Kbd size="md">Enter</Kbd>
            <Kbd size="lg">Space</Kbd>
        </>;
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`function PlatformSpecificKbd() {
  const actionKey = useActionKey();
  return <Kbd>{actionKey} + K</Kbd>;
}`,...c.parameters?.docs?.source}}},d=[`Base`,`Sizes`,`PlatformSpecificKbd`]}))();export{o as Base,c as PlatformSpecificKbd,s as Sizes,d as __namedExportsOrder,u as default};