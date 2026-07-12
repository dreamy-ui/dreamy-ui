import{i as e}from"./preload-helper-CCSz8wUY.js";import{Ct as t,Et as n,Mr as r,St as i,Tt as a,bt as o,ei as s,t as c,wt as l,xt as u}from"./iframe-22HWPPlw.js";import{r as d,t as f}from"./dist-R1h79IYQ.js";function p(){let{isOpen:e,onClose:s,onOpen:c}=d();return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(r,{onClick:c,variant:`primary`,children:`Open Modal`}),(0,v.jsxs)(n,{isOpen:e,onClose:s,children:[(0,v.jsx)(a,{}),(0,v.jsxs)(i,{children:[(0,v.jsx)(l,{children:`Modal Header`}),(0,v.jsx)(u,{}),(0,v.jsx)(o,{children:`Modal Body`}),(0,v.jsx)(t,{children:(0,v.jsx)(r,{onClick:s,children:`Close`})})]})]})]})}function m(){let e=[`sm`,`md`,`lg`,`xl`,`2xl`,`3xl`,`4xl`,`5xl`,`6xl`,`7xl`,`8xl`];function s({size:e}){let{isOpen:s,onClose:c,onOpen:f}=d();return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsxs)(r,{onClick:f,variant:`primary`,children:[`Open `,e,` Modal`]}),(0,v.jsxs)(n,{isOpen:s,onClose:c,size:e,children:[(0,v.jsx)(a,{}),(0,v.jsxs)(i,{children:[(0,v.jsxs)(l,{children:[e,` Modal`]}),(0,v.jsx)(u,{}),(0,v.jsxs)(o,{children:[`This is a `,e,` modal!`]}),(0,v.jsx)(t,{children:(0,v.jsx)(r,{onClick:c,children:`Close`})})]})]})]})}return(0,v.jsx)(v.Fragment,{children:e.map(e=>(0,v.jsx)(s,{size:e},e))})}function h(){let{isOpen:e,onClose:s,onOpen:c}=d();return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(r,{onClick:c,variant:`primary`,children:`Open Modal`}),(0,v.jsxs)(n,{isOpen:e,onClose:s,scrollBehavior:`inside`,children:[(0,v.jsx)(a,{}),(0,v.jsxs)(i,{children:[(0,v.jsx)(l,{children:`Modal Header`}),(0,v.jsx)(u,{}),(0,v.jsx)(o,{children:`Modal Body`}),(0,v.jsx)(t,{children:(0,v.jsx)(r,{onClick:s,children:`Close`})})]})]})]})}function g(){let{isOpen:e,onClose:s,onOpen:c}=d();return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(r,{onClick:c,variant:`primary`,children:`Open Modal`}),(0,v.jsxs)(n,{isOpen:e,onClose:s,placement:`top`,scrollBehavior:`outside`,size:`lg`,children:[(0,v.jsx)(a,{}),(0,v.jsxs)(i,{children:[(0,v.jsx)(l,{children:`Modal Header`}),(0,v.jsx)(u,{}),(0,v.jsx)(o,{children:[...Array(10)].map((e,t)=>(0,v.jsx)(`p`,{children:`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec odio vel dui euismod fermentum.`},t))}),(0,v.jsx)(t,{children:(0,v.jsx)(r,{onClick:s,children:`Close`})})]})]})]})}function _(){let{isOpen:e,onClose:s,onOpen:c}=d();return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(r,{onClick:c,variant:`primary`,children:`Open Modal`}),(0,v.jsxs)(n,{isOpen:e,onClose:s,placement:`top`,children:[(0,v.jsx)(a,{}),(0,v.jsxs)(i,{children:[(0,v.jsx)(l,{children:`Modal Header`}),(0,v.jsx)(u,{}),(0,v.jsx)(o,{children:`Modal Body`}),(0,v.jsx)(t,{children:(0,v.jsx)(r,{onClick:s,children:`Close`})})]})]})]})}var v,y,b;e((()=>{c(),f(),v=s(),y={title:`Modal`},p.__docgenInfo={description:``,methods:[],displayName:`Base`},m.__docgenInfo={description:``,methods:[],displayName:`Sizes`},h.__docgenInfo={description:``,methods:[],displayName:`ScrollBehaviorInside`},g.__docgenInfo={description:``,methods:[],displayName:`ScrollBehaviorOutside`},_.__docgenInfo={description:``,methods:[],displayName:`Placement`},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`function Base() {
  const {
    isOpen,
    onClose,
    onOpen
  } = useControllable();
  return <>
            <Button onClick={onOpen} variant="primary">
                Open Modal
            </Button>

            <Modal.Root isOpen={isOpen} onClose={onClose}>
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>Modal Header</Modal.Header>
                    <Modal.CloseButton />
                    <Modal.Body>Modal Body</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={onClose}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </>;
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`function Sizes() {
  const sizes = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl"] as const;
  function ModalSize({
    size
  }: {
    size: (typeof sizes)[number];
  }) {
    const {
      isOpen,
      onClose,
      onOpen
    } = useControllable();
    return <>
                <Button onClick={onOpen} variant="primary">
                    Open {size} Modal
                </Button>

                <Modal.Root isOpen={isOpen} onClose={onClose} size={size}>
                    <Modal.Overlay />
                    <Modal.Content>
                        <Modal.Header>{size} Modal</Modal.Header>
                        <Modal.CloseButton />
                        <Modal.Body>This is a {size} modal!</Modal.Body>
                        <Modal.Footer>
                            <Button onClick={onClose}>Close</Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal.Root>
            </>;
  }
  return <>
            {sizes.map(size => <ModalSize key={size} size={size} />)}
        </>;
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`function ScrollBehaviorInside() {
  const {
    isOpen,
    onClose,
    onOpen
  } = useControllable();
  return <>
            <Button onClick={onOpen} variant="primary">
                Open Modal
            </Button>

            <Modal.Root isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>Modal Header</Modal.Header>
                    <Modal.CloseButton />
                    <Modal.Body>Modal Body</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={onClose}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </>;
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`function ScrollBehaviorOutside() {
  const {
    isOpen,
    onClose,
    onOpen
  } = useControllable();
  return <>
            <Button onClick={onOpen} variant="primary">
                Open Modal
            </Button>

            <Modal.Root isOpen={isOpen} onClose={onClose} placement="top" scrollBehavior="outside" size="lg">
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>Modal Header</Modal.Header>
                    <Modal.CloseButton />
                    <Modal.Body>
                        {[...Array(10)].map((_, i) => <p key={i}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
                                nec odio vel dui euismod fermentum.
                            </p>)}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={onClose}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </>;
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`function Placement() {
  const {
    isOpen,
    onClose,
    onOpen
  } = useControllable();
  return <>
            <Button onClick={onOpen} variant="primary">
                Open Modal
            </Button>

            <Modal.Root isOpen={isOpen} onClose={onClose} placement="top">
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>Modal Header</Modal.Header>
                    <Modal.CloseButton />
                    <Modal.Body>Modal Body</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={onClose}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </>;
}`,..._.parameters?.docs?.source}}},b=[`Base`,`Sizes`,`ScrollBehaviorInside`,`ScrollBehaviorOutside`,`Placement`]}))();export{p as Base,_ as Placement,h as ScrollBehaviorInside,g as ScrollBehaviorOutside,m as Sizes,b as __namedExportsOrder,y as default};