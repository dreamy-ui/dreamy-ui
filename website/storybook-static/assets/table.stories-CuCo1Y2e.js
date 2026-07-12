import{i as e}from"./preload-helper-CCSz8wUY.js";import{Sr as t,_ as n,b as r,ei as i,g as a,h as o,m as s,t as c,v as l,y as u}from"./iframe-22HWPPlw.js";function d(){return(0,_.jsx)(l,{w:`full`,children:(0,_.jsxs)(r,{children:[(0,_.jsx)(n,{children:(0,_.jsxs)(u,{children:[(0,_.jsx)(a,{children:`Name`}),(0,_.jsx)(a,{children:`Age`}),(0,_.jsx)(a,{children:`Gender`})]})}),(0,_.jsx)(s,{children:[20,22,25].map((e,t)=>(0,_.jsxs)(u,{children:[(0,_.jsxs)(o,{children:[`Name `,t+1]}),(0,_.jsx)(o,{children:e}),(0,_.jsx)(o,{children:e%5==0?`Male`:`Female`})]},t))})]})})}function f(){return(0,_.jsx)(_.Fragment,{children:[`simple`,`line`].map(e=>(0,_.jsxs)(`div`,{children:[(0,_.jsx)(t,{size:`lg`,children:e}),(0,_.jsx)(l,{variant:e,w:`full`,children:(0,_.jsxs)(r,{children:[(0,_.jsx)(n,{children:(0,_.jsxs)(u,{children:[(0,_.jsx)(a,{children:`Name`}),(0,_.jsx)(a,{children:`Age`}),(0,_.jsx)(a,{children:`Gender`})]})}),(0,_.jsx)(s,{children:[20,22,25].map((e,t)=>(0,_.jsxs)(u,{children:[(0,_.jsxs)(o,{children:[`Name `,t+1]}),(0,_.jsx)(o,{children:e}),(0,_.jsx)(o,{children:e%5==0?`Male`:`Female`})]},t))})]})})]},e))})}function p(){return(0,_.jsx)(_.Fragment,{children:[`simple`,`line`].map(e=>(0,_.jsxs)(`div`,{children:[(0,_.jsx)(t,{size:`lg`,children:e}),(0,_.jsx)(l,{variant:e,w:`full`,withBackground:!0,children:(0,_.jsxs)(r,{children:[(0,_.jsx)(n,{children:(0,_.jsxs)(u,{children:[(0,_.jsx)(a,{children:`Name`}),(0,_.jsx)(a,{children:`Age`}),(0,_.jsx)(a,{children:`Gender`})]})}),(0,_.jsx)(s,{children:[20,22,25].map((e,t)=>(0,_.jsxs)(u,{children:[(0,_.jsxs)(o,{children:[`Name `,t+1]}),(0,_.jsx)(o,{children:e}),(0,_.jsx)(o,{children:e%5==0?`Male`:`Female`})]},t))})]})})]},e))})}function m(){return(0,_.jsx)(l,{interactive:!0,w:`full`,children:(0,_.jsxs)(r,{children:[(0,_.jsx)(n,{children:(0,_.jsxs)(u,{children:[(0,_.jsx)(a,{children:`Name`}),(0,_.jsx)(a,{children:`Age`}),(0,_.jsx)(a,{children:`Gender`})]})}),(0,_.jsx)(s,{children:[20,22,25].map((e,t)=>(0,_.jsxs)(u,{children:[(0,_.jsxs)(o,{children:[`Name `,t+1]}),(0,_.jsx)(o,{children:e}),(0,_.jsx)(o,{children:e%5==0?`Male`:`Female`})]},t))})]})})}function h(){return(0,_.jsx)(l,{striped:!0,w:`full`,children:(0,_.jsxs)(r,{children:[(0,_.jsx)(n,{children:(0,_.jsxs)(u,{children:[(0,_.jsx)(a,{children:`Name`}),(0,_.jsx)(a,{children:`Age`}),(0,_.jsx)(a,{children:`Gender`})]})}),(0,_.jsx)(s,{children:[20,22,25,28,31,35].map((e,t)=>(0,_.jsxs)(u,{children:[(0,_.jsxs)(o,{children:[`Name `,t+1]}),(0,_.jsx)(o,{children:e}),(0,_.jsx)(o,{children:e%5==0?`Male`:`Female`})]},t))})]})})}function g(){return(0,_.jsx)(_.Fragment,{children:[`sm`,`md`,`lg`].map(e=>(0,_.jsxs)(`div`,{children:[(0,_.jsx)(t,{size:`lg`,children:e}),(0,_.jsx)(l,{size:e,w:`full`,children:(0,_.jsxs)(r,{children:[(0,_.jsx)(n,{children:(0,_.jsxs)(u,{children:[(0,_.jsx)(a,{children:`Name`}),(0,_.jsx)(a,{children:`Age`}),(0,_.jsx)(a,{children:`Gender`})]})}),(0,_.jsx)(s,{children:[20,22,25].map((e,t)=>(0,_.jsxs)(u,{children:[(0,_.jsxs)(o,{children:[`Name `,t+1]}),(0,_.jsx)(o,{children:e}),(0,_.jsx)(o,{children:e%5==0?`Male`:`Female`})]},t))})]})})]},e))})}var _,v,y;e((()=>{c(),_=i(),v={title:`Table`},d.__docgenInfo={description:``,methods:[],displayName:`Base`},f.__docgenInfo={description:``,methods:[],displayName:`Variants`},p.__docgenInfo={description:``,methods:[],displayName:`WithBackground`},m.__docgenInfo={description:``,methods:[],displayName:`Interactive`},h.__docgenInfo={description:``,methods:[],displayName:`Striped`},g.__docgenInfo={description:``,methods:[],displayName:`Sizes`},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`function Base() {
  return <Table.Root w="full">
            <Table.Table>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Age</Table.ColumnHeader>
                        <Table.ColumnHeader>Gender</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {[20, 22, 25].map((item, index) => <Table.Row key={index}>
                            <Table.Cell>Name {index + 1}</Table.Cell>
                            <Table.Cell>{item}</Table.Cell>
                            <Table.Cell>{item % 5 === 0 ? "Male" : "Female"}</Table.Cell>
                        </Table.Row>)}
                </Table.Body>
            </Table.Table>
        </Table.Root>;
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`function Variants() {
  return <>
            {["simple", "line"].map(variant => <div key={variant}>
                    <Text size="lg">{variant}</Text>
                    <Table.Root variant={variant as any} w="full">
                        <Table.Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                                    <Table.ColumnHeader>Age</Table.ColumnHeader>
                                    <Table.ColumnHeader>Gender</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {[20, 22, 25].map((item, index) => <Table.Row key={index}>
                                        <Table.Cell>Name {index + 1}</Table.Cell>
                                        <Table.Cell>{item}</Table.Cell>
                                        <Table.Cell>
                                            {item % 5 === 0 ? "Male" : "Female"}
                                        </Table.Cell>
                                    </Table.Row>)}
                            </Table.Body>
                        </Table.Table>
                    </Table.Root>
                </div>)}
        </>;
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`function WithBackground() {
  return <>
            {["simple", "line"].map(variant => <div key={variant}>
                    <Text size="lg">{variant}</Text>
                    <Table.Root variant={variant as any} w="full" withBackground>
                        <Table.Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                                    <Table.ColumnHeader>Age</Table.ColumnHeader>
                                    <Table.ColumnHeader>Gender</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {[20, 22, 25].map((item, index) => <Table.Row key={index}>
                                        <Table.Cell>Name {index + 1}</Table.Cell>
                                        <Table.Cell>{item}</Table.Cell>
                                        <Table.Cell>
                                            {item % 5 === 0 ? "Male" : "Female"}
                                        </Table.Cell>
                                    </Table.Row>)}
                            </Table.Body>
                        </Table.Table>
                    </Table.Root>
                </div>)}
        </>;
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`function Interactive() {
  return <Table.Root interactive w="full">
            <Table.Table>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Age</Table.ColumnHeader>
                        <Table.ColumnHeader>Gender</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {[20, 22, 25].map((item, index) => <Table.Row key={index}>
                            <Table.Cell>Name {index + 1}</Table.Cell>
                            <Table.Cell>{item}</Table.Cell>
                            <Table.Cell>{item % 5 === 0 ? "Male" : "Female"}</Table.Cell>
                        </Table.Row>)}
                </Table.Body>
            </Table.Table>
        </Table.Root>;
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`function Striped() {
  return <Table.Root striped w="full">
            <Table.Table>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Age</Table.ColumnHeader>
                        <Table.ColumnHeader>Gender</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {[20, 22, 25, 28, 31, 35].map((item, index) => <Table.Row key={index}>
                            <Table.Cell>Name {index + 1}</Table.Cell>
                            <Table.Cell>{item}</Table.Cell>
                            <Table.Cell>{item % 5 === 0 ? "Male" : "Female"}</Table.Cell>
                        </Table.Row>)}
                </Table.Body>
            </Table.Table>
        </Table.Root>;
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`function Sizes() {
  return <>
            {["sm", "md", "lg"].map(size => <div key={size}>
                    <Text size="lg">{size}</Text>
                    <Table.Root size={size as any} w="full">
                        <Table.Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                                    <Table.ColumnHeader>Age</Table.ColumnHeader>
                                    <Table.ColumnHeader>Gender</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {[20, 22, 25].map((item, index) => <Table.Row key={index}>
                                        <Table.Cell>Name {index + 1}</Table.Cell>
                                        <Table.Cell>{item}</Table.Cell>
                                        <Table.Cell>
                                            {item % 5 === 0 ? "Male" : "Female"}
                                        </Table.Cell>
                                    </Table.Row>)}
                            </Table.Body>
                        </Table.Table>
                    </Table.Root>
                </div>)}
        </>;
}`,...g.parameters?.docs?.source}}},y=[`Base`,`Variants`,`WithBackground`,`Interactive`,`Striped`,`Sizes`]}))();export{d as Base,m as Interactive,g as Sizes,h as Striped,f as Variants,p as WithBackground,y as __namedExportsOrder,v as default};