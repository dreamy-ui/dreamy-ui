import{c as e,i as t}from"./preload-helper-CCSz8wUY.js";import{t as n}from"./react-DaLZQZrY.js";import{M as r,Mr as i,Wr as a,ei as o,or as s,t as c}from"./iframe-22HWPPlw.js";import{i as l,t as u}from"./dist-R1h79IYQ.js";function d(){let{toast:e}=l();return(0,b.jsx)(i,{onClick:()=>e({title:`Welcome!`,description:`Make yourself at home!`}),children:`Toast`})}function f(){let{toast:e}=l();return(0,b.jsx)(s,{gap:2,wrapped:!0,children:[`success`,`error`,`warning`,`info`,`loading`].map(t=>(0,b.jsx)(i,{onClick:()=>e({title:t+`!`,description:`This is a ${t} toast!`,status:t}),children:t},t))})}function p(){let{toast:e}=l();return(0,b.jsx)(s,{gap:2,wrapped:!0,children:[`top-left`,`top`,`top-right`,`bottom-left`,`bottom`,`bottom-right`].map(t=>(0,b.jsx)(i,{onClick:()=>e({title:t,description:`This toast is at ${t}!`,position:t}),children:t},t))})}function m(){let{toast:e}=l();return(0,b.jsxs)(r,{children:[(0,b.jsx)(i,{onClick:()=>e({title:`This toast lasts 10 seconds!`,duration:1e4}),children:`10 seconds`}),(0,b.jsx)(i,{onClick:()=>e({title:`This toast lasts forever!`,description:`To close this toast, you need to click the close button.`,duration:1/0,isClosable:!0}),children:`Infinite`})]})}function h(){let{toast:e}=l();return(0,b.jsx)(i,{onClick:()=>e({title:`Closable`,description:`This toast is closable!`,isClosable:!0}),children:`Closable`})}function g(){let{toast:e}=l();return(0,b.jsx)(i,{onClick:()=>e({title:`Right content`,description:`This toast has a right content!`,rightContent:(0,b.jsx)(i,{size:`sm`,variant:`outline`,children:`Okay`})}),children:`Right content`})}function _(){let{toast:e}=l();return(0,b.jsx)(i,{onClick:()=>e({title:`This toast is custom!`,render:()=>(0,b.jsx)(a,{bg:`primary`,p:4,rounded:`l2`,children:`This is a custom toast!`})}),children:`Custom Render`})}function v(){let{toast:e,updateToast:t}=l(),[n,a]=(0,y.useState)(null);return(0,b.jsxs)(r,{children:[(0,b.jsx)(i,{onClick:()=>{a(e({title:`Loading`,description:`Please wait till file is uploaded!`,status:`loading`,duration:1/0}))},children:`Send Toast`}),(0,b.jsx)(i,{onClick:()=>{n&&t(n,{title:`Success!`,description:`File uploaded successfully!`,status:`success`})},children:`Update Toast`})]})}var y,b,x,S;t((()=>{c(),u(),y=e(n(),1),b=o(),x={title:`Toast`},d.__docgenInfo={description:``,methods:[],displayName:`Base`},f.__docgenInfo={description:``,methods:[],displayName:`Status`},p.__docgenInfo={description:``,methods:[],displayName:`Position`},m.__docgenInfo={description:``,methods:[],displayName:`Duration`},h.__docgenInfo={description:``,methods:[],displayName:`Closable`},g.__docgenInfo={description:``,methods:[],displayName:`RightContent`},_.__docgenInfo={description:``,methods:[],displayName:`CustomRender`},v.__docgenInfo={description:``,methods:[],displayName:`UpdateToast`},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`function Base() {
  const {
    toast
  } = useToast();
  return <Button onClick={() => toast({
    title: "Welcome!",
    description: "Make yourself at home!"
  })}>
            Toast
        </Button>;
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`function Status() {
  const {
    toast
  } = useToast();
  return <Flex gap={2} wrapped>
            {(["success", "error", "warning", "info", "loading"] as const).map(status => <Button key={status} onClick={() => toast({
      title: status + "!",
      description: \`This is a \${status} toast!\`,
      status
    })}>
                    {status}
                </Button>)}
        </Flex>;
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`function Position() {
  const {
    toast
  } = useToast();
  return <Flex gap={2} wrapped>
            {(["top-left", "top", "top-right", "bottom-left", "bottom", "bottom-right"] as const).map(position => <Button key={position} onClick={() => toast({
      title: position,
      description: \`This toast is at \${position}!\`,
      position
    })}>
                    {position}
                </Button>)}
        </Flex>;
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`function Duration() {
  const {
    toast
  } = useToast();
  return <HStack>
            <Button onClick={() => toast({
      title: "This toast lasts 10 seconds!",
      duration: 10_000
    })}>
                10 seconds
            </Button>
            <Button onClick={() => toast({
      title: "This toast lasts forever!",
      description: "To close this toast, you need to click the close button.",
      duration: Number.POSITIVE_INFINITY,
      isClosable: true
    })}>
                Infinite
            </Button>
        </HStack>;
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`function Closable() {
  const {
    toast
  } = useToast();
  return <Button onClick={() => toast({
    title: "Closable",
    description: "This toast is closable!",
    isClosable: true
  })}>
            Closable
        </Button>;
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`function RightContent() {
  const {
    toast
  } = useToast();
  return <Button onClick={() => toast({
    title: "Right content",
    description: "This toast has a right content!",
    rightContent: <Button size="sm" variant="outline">
                            Okay
                        </Button>
  })}>
            Right content
        </Button>;
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`function CustomRender() {
  const {
    toast
  } = useToast();
  return <Button onClick={() => toast({
    title: "This toast is custom!",
    render: () => <Box bg="primary" p={4} rounded="l2">
                            This is a custom toast!
                        </Box>
  })}>
            Custom Render
        </Button>;
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`function UpdateToast() {
  const {
    toast,
    updateToast
  } = useToast();
  const [toastId, setToastId] = useState<string | null>(null);
  return <HStack>
            <Button onClick={() => {
      setToastId(toast({
        title: "Loading",
        description: "Please wait till file is uploaded!",
        status: "loading",
        duration: Number.POSITIVE_INFINITY
      }));
    }}>
                Send Toast
            </Button>
            <Button onClick={() => {
      if (toastId) {
        updateToast(toastId, {
          title: "Success!",
          description: "File uploaded successfully!",
          status: "success"
        });
      }
    }}>
                Update Toast
            </Button>
        </HStack>;
}`,...v.parameters?.docs?.source}}},S=[`Base`,`Status`,`Position`,`Duration`,`Closable`,`RightContent`,`CustomRender`,`UpdateToast`]}))();export{d as Base,h as Closable,_ as CustomRender,m as Duration,p as Position,g as RightContent,f as Status,v as UpdateToast,S as __namedExportsOrder,x as default};