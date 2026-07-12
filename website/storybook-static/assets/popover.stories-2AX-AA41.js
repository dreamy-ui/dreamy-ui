import{c as e,i as t}from"./preload-helper-CCSz8wUY.js";import{t as n}from"./react-DaLZQZrY.js";import{Mr as r,cr as i,dr as a,ei as o,fr as s,lr as c,mr as l,pr as u,t as d,ur as f}from"./iframe-22HWPPlw.js";import{r as p,t as m}from"./dist-R1h79IYQ.js";function h(){return(0,x.jsxs)(u,{hasArrow:!0,children:[(0,x.jsx)(l,{children:(0,x.jsx)(r,{variant:`primary`,w:`fit-content`,children:`Open Popover`})}),(0,x.jsxs)(f,{children:[(0,x.jsx)(c,{}),(0,x.jsx)(s,{children:`Delete Post`}),(0,x.jsx)(i,{children:`Are you sure you want to delete this post? This action cannot be undone.`}),(0,x.jsx)(a,{children:(0,x.jsx)(r,{variant:`primary`,children:`Delete`})})]})]})}function g(){let{isOpen:e,onOpen:t,onClose:n}=p(),o=(0,b.useCallback)(()=>{n()},[n]);return(0,x.jsxs)(u,{hasArrow:!0,isOpen:e,onClose:n,onOpen:t,children:[(0,x.jsx)(l,{children:(0,x.jsx)(r,{variant:`primary`,children:`Open Popover`})}),(0,x.jsxs)(f,{children:[(0,x.jsx)(c,{}),(0,x.jsx)(s,{children:`Delete Post`}),(0,x.jsx)(i,{children:`Are you sure you want to delete this post? This action cannot be undone.`}),(0,x.jsxs)(a,{children:[(0,x.jsx)(r,{onClick:n,variant:`solid`,children:`Cancel`}),(0,x.jsx)(r,{onClick:o,variant:`primary`,children:`Delete`})]})]})]})}function _(){let{isOpen:e,onOpen:t,onClose:n}=p(),o=(0,b.useRef)(null);return(0,x.jsxs)(u,{hasArrow:!0,initialFocusRef:o,isOpen:e,onClose:n,onOpen:t,children:[(0,x.jsx)(l,{children:(0,x.jsx)(r,{variant:`primary`,children:`Open Popover`})}),(0,x.jsxs)(f,{children:[(0,x.jsx)(c,{}),(0,x.jsx)(s,{children:`Delete Post`}),(0,x.jsx)(i,{children:`Are you sure you want to delete this post? This action cannot be undone.`}),(0,x.jsxs)(a,{children:[(0,x.jsx)(r,{onClick:n,ref:o,variant:`solid`,children:`Cancel`}),(0,x.jsx)(r,{variant:`primary`,children:`Delete`})]})]})]})}function v(){return(0,x.jsx)(x.Fragment,{children:[`sm`,`md`,`lg`,`xl`,`2xl`,`3xl`,`4xl`,`5xl`,`6xl`,`7xl`,`8xl`].map(e=>(0,x.jsxs)(u,{hasArrow:!0,size:e,children:[(0,x.jsx)(l,{children:(0,x.jsx)(r,{variant:`primary`,w:`fit-content`,children:e})}),(0,x.jsxs)(f,{children:[(0,x.jsx)(c,{}),(0,x.jsx)(s,{children:`Delete Post`}),(0,x.jsx)(i,{children:`Are you sure you want to delete this post? This action cannot be undone.`}),(0,x.jsx)(a,{children:(0,x.jsx)(r,{variant:`primary`,children:`Delete`})})]})]},e))})}function y(){return(0,x.jsxs)(u,{hasArrow:!0,reduceMotion:!0,children:[(0,x.jsx)(l,{children:(0,x.jsx)(r,{variant:`primary`,w:`fit-content`,children:`Reduced Motion`})}),(0,x.jsxs)(f,{children:[(0,x.jsx)(c,{}),(0,x.jsx)(s,{children:`Delete Post`}),(0,x.jsx)(i,{children:`Are you sure you want to delete this post? This action cannot be undone.`}),(0,x.jsx)(a,{children:(0,x.jsx)(r,{variant:`primary`,children:`Delete`})})]})]})}var b,x,S,C;t((()=>{d(),m(),b=e(n(),1),x=o(),S={title:`Popover`},h.__docgenInfo={description:``,methods:[],displayName:`Base`},g.__docgenInfo={description:``,methods:[],displayName:`ControlledPopover`},_.__docgenInfo={description:``,methods:[],displayName:`InitialFocus`},v.__docgenInfo={description:``,methods:[],displayName:`Sizes`},y.__docgenInfo={description:``,methods:[],displayName:`ReduceMotion`},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`function Base() {
  return <Popover.Root hasArrow>
            <Popover.Trigger>
                <Button variant="primary" w="fit-content">
                    Open Popover
                </Button>
            </Popover.Trigger>

            <Popover.Content>
                <Popover.CloseButton />
                <Popover.Header>Delete Post</Popover.Header>
                <Popover.Body>
                    Are you sure you want to delete this post? This action cannot be undone.
                </Popover.Body>
                <Popover.Footer>
                    <Button variant="primary">Delete</Button>
                </Popover.Footer>
            </Popover.Content>
        </Popover.Root>;
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`function ControlledPopover() {
  const {
    isOpen,
    onOpen,
    onClose
  } = useControllable();
  const handleDelete = useCallback(() => {
    onClose();
  }, [onClose]);
  return <Popover.Root hasArrow isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
            <Popover.Trigger>
                <Button variant="primary">Open Popover</Button>
            </Popover.Trigger>

            <Popover.Content>
                <Popover.CloseButton />
                <Popover.Header>Delete Post</Popover.Header>
                <Popover.Body>
                    Are you sure you want to delete this post? This action cannot be undone.
                </Popover.Body>
                <Popover.Footer>
                    <Button onClick={onClose} variant="solid">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} variant="primary">
                        Delete
                    </Button>
                </Popover.Footer>
            </Popover.Content>
        </Popover.Root>;
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`function InitialFocus() {
  const {
    isOpen,
    onOpen,
    onClose
  } = useControllable();
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  return <Popover.Root hasArrow initialFocusRef={initialFocusRef} isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
            <Popover.Trigger>
                <Button variant="primary">Open Popover</Button>
            </Popover.Trigger>

            <Popover.Content>
                <Popover.CloseButton />
                <Popover.Header>Delete Post</Popover.Header>
                <Popover.Body>
                    Are you sure you want to delete this post? This action cannot be undone.
                </Popover.Body>
                <Popover.Footer>
                    <Button onClick={onClose} ref={initialFocusRef} variant="solid">
                        Cancel
                    </Button>
                    <Button variant="primary">Delete</Button>
                </Popover.Footer>
            </Popover.Content>
        </Popover.Root>;
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`function Sizes() {
  return <>
            {(["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl"] as const).map(size => <Popover.Root hasArrow key={size} size={size}>
                    <Popover.Trigger>
                        <Button variant="primary" w="fit-content">
                            {size}
                        </Button>
                    </Popover.Trigger>

                    <Popover.Content>
                        <Popover.CloseButton />
                        <Popover.Header>Delete Post</Popover.Header>
                        <Popover.Body>
                            Are you sure you want to delete this post? This action cannot be undone.
                        </Popover.Body>
                        <Popover.Footer>
                            <Button variant="primary">Delete</Button>
                        </Popover.Footer>
                    </Popover.Content>
                </Popover.Root>)}
        </>;
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`function ReduceMotion() {
  return <Popover.Root hasArrow reduceMotion>
            <Popover.Trigger>
                <Button variant="primary" w="fit-content">
                    Reduced Motion
                </Button>
            </Popover.Trigger>

            <Popover.Content>
                <Popover.CloseButton />
                <Popover.Header>Delete Post</Popover.Header>
                <Popover.Body>
                    Are you sure you want to delete this post? This action cannot be undone.
                </Popover.Body>
                <Popover.Footer>
                    <Button variant="primary">Delete</Button>
                </Popover.Footer>
            </Popover.Content>
        </Popover.Root>;
}`,...y.parameters?.docs?.source}}},C=[`Base`,`ControlledPopover`,`InitialFocus`,`Sizes`,`ReduceMotion`]}))();export{h as Base,g as ControlledPopover,_ as InitialFocus,y as ReduceMotion,v as Sizes,C as __namedExportsOrder,S as default};