import{c as e,i as t}from"./preload-helper-CCSz8wUY.js";import{t as n}from"./react-DaLZQZrY.js";import{i as r,n as i,o as a,p as o}from"./lu-BLJr3Y7e.js";import{J as s,M as c,Pr as l,Sr as u,Wr as d,X as f,Y as p,Z as m,ei as h,t as g}from"./iframe-22HWPPlw.js";function _(){return(0,j.jsxs)(p,{items:M,width:`xs`,children:[(0,j.jsx)(f,{placeholder:`Select a favorite fruit`}),(0,j.jsx)(s,{})]})}function v(){return(0,j.jsx)(c,{children:[`xs`,`sm`,`md`,`lg`].map(e=>(0,j.jsxs)(p,{items:M,size:e,width:`xs`,children:[(0,j.jsx)(f,{placeholder:`Select a favorite fruit`}),(0,j.jsx)(s,{})]},e))})}function y(){return(0,j.jsx)(c,{children:[`outline`,`solid`].map(e=>(0,j.jsxs)(p,{items:M,triggerVariant:e,width:`xs`,children:[(0,j.jsx)(f,{placeholder:`Select a favorite fruit`}),(0,j.jsx)(s,{})]},e))})}function b(){return(0,j.jsx)(c,{children:[`plain`,`stretched`].map(e=>(0,j.jsxs)(p,{items:M,variant:e,width:`xs`,children:[(0,j.jsx)(f,{placeholder:`Select a favorite fruit`}),(0,j.jsx)(s,{})]},e))})}function x(){let[e,t]=(0,A.useState)(`strawberry`);return(0,j.jsxs)(p,{items:M,onChangeValue:t,value:e,width:`xs`,children:[(0,j.jsx)(f,{placeholder:`Select a favorite fruit`}),(0,j.jsx)(s,{})]})}function S(){return(0,j.jsxs)(p,{items:N,renderItem:e=>(0,j.jsxs)(c,{children:[e.icon,(0,j.jsx)(u,{children:e.label})]}),width:`xs`,children:[(0,j.jsx)(f,{placeholder:`Select a favorite fruit`}),(0,j.jsx)(s,{})]})}function C(){return(0,j.jsxs)(p,{items:N,width:`xs`,children:[(0,j.jsx)(f,{icon:(0,j.jsx)(r,{}),placeholder:`Select a favorite fruit`}),(0,j.jsx)(s,{})]})}function w(){return(0,j.jsxs)(p,{isClearable:!0,items:N,width:`xs`,children:[(0,j.jsx)(f,{placeholder:`Select a favorite fruit`}),(0,j.jsx)(s,{})]})}function T(){return(0,j.jsxs)(p,{isMultiple:!0,items:M,width:`xs`,children:[(0,j.jsx)(f,{placeholder:`Select a favorite fruit`}),(0,j.jsx)(s,{})]})}function E(){return(0,j.jsxs)(p,{isMultiple:!0,items:M,width:`xs`,children:[(0,j.jsx)(f,{multipleSelectedText:e=>`${e.length} selected`,placeholder:`Select a favorite fruit`}),(0,j.jsx)(s,{})]})}function D(){let[e,t]=(0,A.useState)(!1),[n,r]=(0,A.useState)([]);function i(){n.length>0||(t(!0),setTimeout(()=>{r([{value:`Cherry`,label:`Cherry`},{value:`Banana`,label:`Banana`},{value:`Orange`,label:`Orange`}]),t(!1)},1e3))}return(0,j.jsxs)(d,{children:[(0,j.jsxs)(p,{items:n,onOpen:i,width:`xs`,children:[(0,j.jsx)(f,{placeholder:`Select a favorite fruit`}),(0,j.jsx)(s,{})]}),e&&(0,j.jsx)(l,{color:`primary`,py:4})]})}function O(){let e=Array.from({length:250},(e,t)=>({value:t.toString(),label:`Item ${t+1}`}));return(0,j.jsxs)(p,{items:e,width:`xs`,children:[(0,j.jsx)(f,{placeholder:`Select a number`}),(0,j.jsx)(m,{})]})}function k(){return(0,j.jsxs)(p,{closeOnSelect:!1,items:M,width:`xs`,children:[(0,j.jsx)(f,{placeholder:`Select a favorite fruit`}),(0,j.jsx)(s,{})]})}var A,j,M,N,P,F;t((()=>{g(),A=e(n(),1),o(),j=h(),M=[{value:`strawberry`,label:`Strawberry`},{value:`banana`,label:`Banana`},{value:`orange`,label:`Orange`}],N=[{value:`cherry`,label:`Cherry`,icon:(0,j.jsx)(r,{})},{value:`banana`,label:`Banana`,icon:(0,j.jsx)(i,{})},{value:`orange`,label:`Orange`,icon:(0,j.jsx)(a,{})}],P={title:`Select`},_.__docgenInfo={description:``,methods:[],displayName:`Base`},v.__docgenInfo={description:``,methods:[],displayName:`Size`},y.__docgenInfo={description:``,methods:[],displayName:`TriggerVariant`},b.__docgenInfo={description:``,methods:[],displayName:`Variant`},x.__docgenInfo={description:``,methods:[],displayName:`Controlled`},S.__docgenInfo={description:``,methods:[],displayName:`WithItems`},C.__docgenInfo={description:``,methods:[],displayName:`WithOneIcon`},w.__docgenInfo={description:``,methods:[],displayName:`Clearable`},T.__docgenInfo={description:``,methods:[],displayName:`Multiple`},E.__docgenInfo={description:``,methods:[],displayName:`CustomMultipleSelectedText`},D.__docgenInfo={description:``,methods:[],displayName:`AsyncLoading`},O.__docgenInfo={description:``,methods:[],displayName:`Virtualized`},k.__docgenInfo={description:``,methods:[],displayName:`CloseOnSelect`},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`function Base() {
  return <Select.Root items={fruits} width="xs">
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content />
        </Select.Root>;
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`function Size() {
  return <HStack>
            {(["xs", "sm", "md", "lg"] as const).map(size => <Select.Root items={fruits} key={size} size={size} width="xs">
                    <Select.Trigger placeholder="Select a favorite fruit" />
                    <Select.Content />
                </Select.Root>)}
        </HStack>;
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`function TriggerVariant() {
  return <HStack>
            {(["outline", "solid"] as const).map(triggerVariant => <Select.Root items={fruits} key={triggerVariant} triggerVariant={triggerVariant} width="xs">
                    <Select.Trigger placeholder="Select a favorite fruit" />
                    <Select.Content />
                </Select.Root>)}
        </HStack>;
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`function Variant() {
  return <HStack>
            {(["plain", "stretched"] as const).map(variant => <Select.Root items={fruits} key={variant} variant={variant} width="xs">
                    <Select.Trigger placeholder="Select a favorite fruit" />
                    <Select.Content />
                </Select.Root>)}
        </HStack>;
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`function Controlled() {
  const [value, setValue] = useState<string>("strawberry");
  return <Select.Root items={fruits} onChangeValue={setValue} value={value} width="xs">
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content />
        </Select.Root>;
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`function WithItems() {
  return <Select.Root items={fruitsWithIcons} renderItem={item => <HStack>
                    {item.icon}
                    <Text>{item.label}</Text>
                </HStack>} width="xs">
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content />
        </Select.Root>;
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`function WithOneIcon() {
  return <Select.Root items={fruitsWithIcons} width="xs">
            <Select.Trigger icon={<LuCherry />} placeholder="Select a favorite fruit" />
            <Select.Content />
        </Select.Root>;
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`function Clearable() {
  return <Select.Root isClearable items={fruitsWithIcons} width="xs">
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content />
        </Select.Root>;
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`function Multiple() {
  return <Select.Root isMultiple items={fruits} width="xs">
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content />
        </Select.Root>;
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`function CustomMultipleSelectedText() {
  return <Select.Root isMultiple items={fruits} width="xs">
            <Select.Trigger multipleSelectedText={selected => \`\${selected.length} selected\`} placeholder="Select a favorite fruit" />
            <Select.Content />
        </Select.Root>;
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`function AsyncLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<{
    value: string;
    label: string;
  }[]>([]);
  function fetchFruits() {
    if (items.length > 0) return;
    setIsLoading(true);
    setTimeout(() => {
      setItems([{
        value: "Cherry",
        label: "Cherry"
      }, {
        value: "Banana",
        label: "Banana"
      }, {
        value: "Orange",
        label: "Orange"
      }]);
      setIsLoading(false);
    }, 1000);
  }
  return <Box>
            <Select.Root items={items} onOpen={fetchFruits} width="xs">
                <Select.Trigger placeholder="Select a favorite fruit" />
                <Select.Content />
            </Select.Root>
            {isLoading && <Spinner color="primary" py={4} />}
        </Box>;
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`function Virtualized() {
  const manyItems = Array.from({
    length: 250
  }, (_, index) => ({
    value: index.toString(),
    label: \`Item \${index + 1}\`
  }));
  return <Select.Root items={manyItems} width="xs">
            <Select.Trigger placeholder="Select a number" />
            <Select.VirtualContent />
        </Select.Root>;
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`function CloseOnSelect() {
  return <Select.Root closeOnSelect={false} items={fruits} width="xs">
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content />
        </Select.Root>;
}`,...k.parameters?.docs?.source}}},F=[`Base`,`Size`,`TriggerVariant`,`Variant`,`Controlled`,`WithItems`,`WithOneIcon`,`Clearable`,`Multiple`,`CustomMultipleSelectedText`,`AsyncLoading`,`Virtualized`,`CloseOnSelect`]}))();export{D as AsyncLoading,_ as Base,w as Clearable,k as CloseOnSelect,x as Controlled,E as CustomMultipleSelectedText,T as Multiple,v as Size,y as TriggerVariant,b as Variant,O as Virtualized,S as WithItems,C as WithOneIcon,F as __namedExportsOrder,P as default};