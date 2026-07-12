import{c as e,i as t}from"./preload-helper-CCSz8wUY.js";import{t as n}from"./react-DaLZQZrY.js";import{M as r,Sr as i,dn as a,ei as o,fn as s,hn as c,mn as l,pn as u,t as d,un as f}from"./iframe-22HWPPlw.js";function p(){return(0,x.jsxs)(l,{defaultValue:`Meow`,placeholder:`Enter an animal sound`,children:[(0,x.jsx)(u,{}),(0,x.jsx)(s,{}),(0,x.jsxs)(r,{children:[(0,x.jsx)(a,{}),(0,x.jsx)(c,{}),(0,x.jsx)(f,{})]})]})}function m(){return(0,x.jsxs)(l,{defaultValue:`Meow`,placeholder:`Enter an animal sound`,useDoubleClick:!0,children:[(0,x.jsx)(u,{}),(0,x.jsx)(s,{})]})}function h(){let[e,t]=(0,b.useState)(`Meow`);return(0,x.jsxs)(l,{onChange:t,value:e,children:[(0,x.jsx)(u,{}),(0,x.jsx)(s,{}),(0,x.jsxs)(r,{children:[(0,x.jsx)(a,{}),(0,x.jsx)(c,{}),(0,x.jsx)(f,{})]})]})}function g(){return(0,x.jsx)(l,{defaultValue:`Meow`,placeholder:`Enter an animal sound`,children:({isEditing:e})=>(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(i,{children:[`isEditing: `,e?`true`:`false`]}),(0,x.jsx)(u,{}),(0,x.jsx)(s,{}),(0,x.jsxs)(r,{children:[(0,x.jsx)(a,{}),(0,x.jsx)(c,{}),(0,x.jsx)(f,{})]})]})})}function _(){return(0,x.jsxs)(l,{defaultValue:`Meow`,isPreviewFocusable:!1,placeholder:`Enter an animal sound`,children:[(0,x.jsx)(u,{}),(0,x.jsx)(s,{}),(0,x.jsxs)(r,{children:[(0,x.jsx)(a,{}),(0,x.jsx)(c,{}),(0,x.jsx)(f,{})]})]})}function v(){return(0,x.jsxs)(l,{defaultValue:`Meow`,placeholder:`Enter an animal sound`,submitOnBlur:!1,children:[(0,x.jsx)(u,{}),(0,x.jsx)(s,{}),(0,x.jsxs)(r,{children:[(0,x.jsx)(a,{}),(0,x.jsx)(c,{}),(0,x.jsx)(f,{})]})]})}function y(){return(0,x.jsxs)(l,{defaultValue:`Meow`,placeholder:`Enter an animal sound`,selectAllOnFocus:!1,children:[(0,x.jsx)(u,{}),(0,x.jsx)(s,{}),(0,x.jsxs)(r,{children:[(0,x.jsx)(a,{}),(0,x.jsx)(c,{}),(0,x.jsx)(f,{})]})]})}var b,x,S,C;t((()=>{d(),b=e(n(),1),x=o(),S={title:`Editable`},p.__docgenInfo={description:``,methods:[],displayName:`Base`},m.__docgenInfo={description:``,methods:[],displayName:`DoubleClick`},h.__docgenInfo={description:``,methods:[],displayName:`Controlled`},g.__docgenInfo={description:``,methods:[],displayName:`AccessingInternalState`},_.__docgenInfo={description:``,methods:[],displayName:`IsPreviewFocusable`},v.__docgenInfo={description:``,methods:[],displayName:`SubmitOnBlur`},y.__docgenInfo={description:``,methods:[],displayName:`SelectAllOnFocus`},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`function Base() {
  return <Editable.Root defaultValue="Meow" placeholder="Enter an animal sound">
            <Editable.Preview />
            <Editable.Input />
            <HStack>
                <Editable.EditButton />
                <Editable.SubmitButton />
                <Editable.CancelButton />
            </HStack>
        </Editable.Root>;
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`function DoubleClick() {
  return <Editable.Root defaultValue="Meow" placeholder="Enter an animal sound" useDoubleClick>
            <Editable.Preview />
            <Editable.Input />
        </Editable.Root>;
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`function Controlled() {
  const [value, setValue] = useState("Meow");
  return <Editable.Root onChange={setValue} value={value}>
            <Editable.Preview />
            <Editable.Input />
            <HStack>
                <Editable.EditButton />
                <Editable.SubmitButton />
                <Editable.CancelButton />
            </HStack>
        </Editable.Root>;
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`function AccessingInternalState() {
  return <Editable.Root defaultValue="Meow" placeholder="Enter an animal sound">
            {({
      isEditing
    }) => {
      return <>
                        <Text>isEditing: {isEditing ? "true" : "false"}</Text>
                        <Editable.Preview />
                        <Editable.Input />
                        <HStack>
                            <Editable.EditButton />
                            <Editable.SubmitButton />
                            <Editable.CancelButton />
                        </HStack>
                    </>;
    }}
        </Editable.Root>;
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`function IsPreviewFocusable() {
  return <Editable.Root defaultValue="Meow" isPreviewFocusable={false} placeholder="Enter an animal sound">
            <Editable.Preview />
            <Editable.Input />
            <HStack>
                <Editable.EditButton />
                <Editable.SubmitButton />
                <Editable.CancelButton />
            </HStack>
        </Editable.Root>;
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`function SubmitOnBlur() {
  return <Editable.Root defaultValue="Meow" placeholder="Enter an animal sound" submitOnBlur={false}>
            <Editable.Preview />
            <Editable.Input />
            <HStack>
                <Editable.EditButton />
                <Editable.SubmitButton />
                <Editable.CancelButton />
            </HStack>
        </Editable.Root>;
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`function SelectAllOnFocus() {
  return <Editable.Root defaultValue="Meow" placeholder="Enter an animal sound" selectAllOnFocus={false}>
            <Editable.Preview />
            <Editable.Input />
            <HStack>
                <Editable.EditButton />
                <Editable.SubmitButton />
                <Editable.CancelButton />
            </HStack>
        </Editable.Root>;
}`,...y.parameters?.docs?.source}}},C=[`Base`,`DoubleClick`,`Controlled`,`AccessingInternalState`,`IsPreviewFocusable`,`SubmitOnBlur`,`SelectAllOnFocus`]}))();export{g as AccessingInternalState,p as Base,h as Controlled,m as DoubleClick,_ as IsPreviewFocusable,y as SelectAllOnFocus,v as SubmitOnBlur,C as __namedExportsOrder,S as default};