import{i as e}from"./preload-helper-CCSz8wUY.js";import{P as t,bn as n,ei as r,en as i,ir as a,nn as o,t as s,tn as c,vr as l,yn as u}from"./iframe-22HWPPlw.js";function d(){return(0,_.jsx)(l,{placeholder:`Enter your username`})}function f(){return(0,_.jsxs)(t,{w:`full`,children:[(0,_.jsx)(l,{placeholder:`Enter your username`,size:`sm`}),(0,_.jsx)(l,{placeholder:`Enter your username`,size:`md`}),(0,_.jsx)(l,{placeholder:`Enter your username`,size:`lg`})]})}function p(){return(0,_.jsxs)(t,{w:`full`,children:[(0,_.jsx)(l,{placeholder:`Enter your username`,variant:`outline`}),(0,_.jsx)(l,{placeholder:`Enter your username`,variant:`filled`}),(0,_.jsx)(l,{placeholder:`Enter your username`,variant:`flushed`}),(0,_.jsx)(l,{placeholder:`Enter your username`,variant:`filledOutline`})]})}function m(){return(0,_.jsxs)(t,{w:`full`,children:[(0,_.jsx)(l,{isInvalid:!0,placeholder:`Enter your username`,variant:`outline`}),(0,_.jsx)(l,{isInvalid:!0,placeholder:`Enter your username`,variant:`filled`}),(0,_.jsx)(l,{isInvalid:!0,placeholder:`Enter your username`,variant:`flushed`}),(0,_.jsx)(l,{isInvalid:!0,placeholder:`Enter your username`,variant:`filledOutline`})]})}function h(){return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsxs)(l.Group,{children:[(0,_.jsx)(l.StartAddon,{children:(0,_.jsx)(a,{as:(0,_.jsx)(u,{}),boxSize:`5`,color:`fg.medium`})}),(0,_.jsx)(l,{ps:`10`,placeholder:`Search for...`})]}),(0,_.jsxs)(l.Group,{children:[(0,_.jsx)(l.Prefix,{children:`$`}),(0,_.jsx)(l,{placeholder:`Product Price`})]}),(0,_.jsxs)(l.Group,{children:[(0,_.jsx)(l.Prefix,{children:`https://`}),(0,_.jsx)(l,{placeholder:`Domain`}),(0,_.jsx)(l.Suffix,{children:`.com`})]})]})}function g(){return(0,_.jsxs)(o,{children:[(0,_.jsx)(c,{children:`Username`}),(0,_.jsx)(l,{placeholder:`Enter your username`}),(0,_.jsx)(i,{children:`Username should not contain special characters.`})]})}var _,v,y;e((()=>{s(),n(),_=r(),v={title:`Input`},d.__docgenInfo={description:``,methods:[],displayName:`Base`},f.__docgenInfo={description:``,methods:[],displayName:`Sizes`},p.__docgenInfo={description:``,methods:[],displayName:`Variants`},m.__docgenInfo={description:``,methods:[],displayName:`Invalid`},h.__docgenInfo={description:``,methods:[],displayName:`InputGroup_`},g.__docgenInfo={description:``,methods:[],displayName:`UsageWithField`},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`function Base() {
  return <Input placeholder="Enter your username" />;
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`function Sizes() {
  return <VStack w="full">
            <Input placeholder="Enter your username" size="sm" />
            <Input placeholder="Enter your username" size="md" />
            <Input placeholder="Enter your username" size="lg" />
        </VStack>;
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`function Variants() {
  return <VStack w="full">
            <Input placeholder="Enter your username" variant="outline" />
            <Input placeholder="Enter your username" variant="filled" />
            <Input placeholder="Enter your username" variant="flushed" />
            <Input placeholder="Enter your username" variant="filledOutline" />
        </VStack>;
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`function Invalid() {
  return <VStack w="full">
            <Input isInvalid placeholder="Enter your username" variant="outline" />
            <Input isInvalid placeholder="Enter your username" variant="filled" />
            <Input isInvalid placeholder="Enter your username" variant="flushed" />
            <Input isInvalid placeholder="Enter your username" variant="filledOutline" />
        </VStack>;
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`function InputGroup_() {
  return <>
            <Input.Group>
                <Input.StartAddon>
                    <Icon as={<BiSearch />} boxSize="5" color="fg.medium" />
                </Input.StartAddon>
                <Input ps="10" placeholder="Search for..." />
            </Input.Group>

            <Input.Group>
                <Input.Prefix>$</Input.Prefix>
                <Input placeholder="Product Price" />
            </Input.Group>

            <Input.Group>
                <Input.Prefix>https://</Input.Prefix>
                <Input placeholder="Domain" />
                <Input.Suffix>.com</Input.Suffix>
            </Input.Group>
        </>;
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`function UsageWithField() {
  return <Field.Root>
            <Field.Label>Username</Field.Label>
            <Input placeholder="Enter your username" />
            <Field.Hint>Username should not contain special characters.</Field.Hint>
        </Field.Root>;
}`,...g.parameters?.docs?.source}}},y=[`Base`,`Sizes`,`Variants`,`Invalid`,`InputGroup_`,`UsageWithField`]}))();export{d as Base,h as InputGroup_,m as Invalid,f as Sizes,g as UsageWithField,p as Variants,y as __namedExportsOrder,v as default};