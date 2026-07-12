import{i as e}from"./preload-helper-CCSz8wUY.js";import{f as t,p as n,u as r}from"./lu-BLJr3Y7e.js";import{Dr as i,Er as a,Mr as o,Or as s,S as c,Tr as l,ei as u,t as d,wr as f}from"./iframe-22HWPPlw.js";import{r as p,t as m}from"./dist-R1h79IYQ.js";function h(){let{isOpen:e,onToggle:n,onClose:u}=p();return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(c,{isChecked:e,onChangeValue:n,size:`sm`,children:`Show Action Bar`}),(0,y.jsx)(a,{isOpen:e,onClose:u,children:(0,y.jsxs)(l,{children:[(0,y.jsx)(i,{children:`2 items selected`}),(0,y.jsx)(s,{}),(0,y.jsx)(o,{rightIcon:(0,y.jsx)(t,{}),size:`sm`,variant:`outline`,children:`Delete`}),(0,y.jsx)(o,{rightIcon:(0,y.jsx)(r,{}),size:`sm`,variant:`outline`,children:`Share`})]})})]})}function g(){let{isOpen:e,onToggle:n,onClose:r}=p();return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(c,{isChecked:e,onChangeValue:n,size:`sm`,children:`Show Action Bar`}),(0,y.jsx)(a,{isOpen:e,onClose:r,children:(0,y.jsxs)(l,{children:[(0,y.jsx)(i,{children:`5 items selected`}),(0,y.jsx)(s,{}),(0,y.jsx)(o,{size:`sm`,variant:`outline`,children:`Add to collection`}),(0,y.jsx)(o,{color:`error`,rightIcon:(0,y.jsx)(t,{}),size:`sm`,children:`Delete items`}),(0,y.jsx)(f,{})]})})]})}function _(){let{isOpen:e,onToggle:n,onClose:r}=p();return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(c,{isChecked:e,onChangeValue:n,size:`sm`,children:`Show Action Bar`}),(0,y.jsx)(a,{isOpen:e,onClose:r,children:(0,y.jsxs)(l,{children:[(0,y.jsx)(i,{children:`12 files selected`}),(0,y.jsx)(s,{}),(0,y.jsx)(o,{size:`sm`,variant:`outline`,children:`Download`}),(0,y.jsx)(o,{size:`sm`,variant:`outline`,children:`Share`}),(0,y.jsx)(o,{size:`sm`,variant:`outline`,children:`Move to folder`}),(0,y.jsx)(s,{}),(0,y.jsx)(o,{color:`error`,rightIcon:(0,y.jsx)(t,{}),size:`sm`,children:`Delete`})]})})]})}function v(){let{isOpen:e,onToggle:t,onClose:n}=p(),{isOpen:r,onToggle:u,onClose:d}=p(),{isOpen:m,onToggle:h,onClose:g}=p();return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(c,{isChecked:e,onChangeValue:t,size:`sm`,children:`Show Small Action Bar`}),(0,y.jsx)(a,{isOpen:e,onClose:n,size:`sm`,children:(0,y.jsxs)(l,{children:[(0,y.jsx)(i,{children:`2 selected`}),(0,y.jsx)(s,{}),(0,y.jsx)(o,{color:`error`,size:`sm`,variant:`outline`,children:`Delete`}),(0,y.jsx)(f,{size:`sm`})]})}),(0,y.jsx)(c,{isChecked:r,onChangeValue:u,size:`sm`,children:`Show Medium Action Bar`}),(0,y.jsx)(a,{isOpen:r,onClose:d,size:`md`,children:(0,y.jsxs)(l,{children:[(0,y.jsx)(i,{children:`2 selected`}),(0,y.jsx)(s,{}),(0,y.jsx)(o,{color:`error`,size:`md`,variant:`outline`,children:`Delete`}),(0,y.jsx)(f,{size:`md`})]})}),(0,y.jsx)(c,{isChecked:m,onChangeValue:h,size:`sm`,children:`Show Large Action Bar`}),(0,y.jsx)(a,{isOpen:m,onClose:g,size:`lg`,children:(0,y.jsxs)(l,{children:[(0,y.jsx)(i,{children:`2 selected`}),(0,y.jsx)(s,{}),(0,y.jsx)(o,{color:`error`,size:`lg`,variant:`outline`,children:`Delete`}),(0,y.jsx)(f,{size:`lg`})]})})]})}var y,b,x;e((()=>{d(),m(),n(),y=u(),b={title:`Action Bar`},h.__docgenInfo={description:``,methods:[],displayName:`Base`},g.__docgenInfo={description:``,methods:[],displayName:`WithClose`},_.__docgenInfo={description:``,methods:[],displayName:`MultipleActions`},v.__docgenInfo={description:``,methods:[],displayName:`Sizes`},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`function Base() {
  const {
    isOpen,
    onToggle,
    onClose
  } = useControllable();
  return <>
            <Switch isChecked={isOpen} onChangeValue={onToggle} size="sm">
                Show Action Bar
            </Switch>

            <ActionBar.Root isOpen={isOpen} onClose={onClose}>
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>2 items selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button rightIcon={<LuTrash />} size="sm" variant="outline">
                        Delete
                    </Button>
                    <Button rightIcon={<LuShare />} size="sm" variant="outline">
                        Share
                    </Button>
                </ActionBar.Content>
            </ActionBar.Root>
        </>;
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`function WithClose() {
  const {
    isOpen,
    onToggle,
    onClose
  } = useControllable();
  return <>
            <Switch isChecked={isOpen} onChangeValue={onToggle} size="sm">
                Show Action Bar
            </Switch>

            <ActionBar.Root isOpen={isOpen} onClose={onClose}>
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>5 items selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button size="sm" variant="outline">
                        Add to collection
                    </Button>
                    <Button color="error" rightIcon={<LuTrash />} size="sm">
                        Delete items
                    </Button>
                    <ActionBar.CloseTrigger />
                </ActionBar.Content>
            </ActionBar.Root>
        </>;
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`function MultipleActions() {
  const {
    isOpen,
    onToggle,
    onClose
  } = useControllable();
  return <>
            <Switch isChecked={isOpen} onChangeValue={onToggle} size="sm">
                Show Action Bar
            </Switch>

            <ActionBar.Root isOpen={isOpen} onClose={onClose}>
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>12 files selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button size="sm" variant="outline">
                        Download
                    </Button>
                    <Button size="sm" variant="outline">
                        Share
                    </Button>
                    <Button size="sm" variant="outline">
                        Move to folder
                    </Button>
                    <ActionBar.Separator />
                    <Button color="error" rightIcon={<LuTrash />} size="sm">
                        Delete
                    </Button>
                </ActionBar.Content>
            </ActionBar.Root>
        </>;
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`function Sizes() {
  const {
    isOpen: isOpenSm,
    onToggle: onToggleSm,
    onClose: onCloseSm
  } = useControllable();
  const {
    isOpen: isOpenMd,
    onToggle: onToggleMd,
    onClose: onCloseMd
  } = useControllable();
  const {
    isOpen: isOpenLg,
    onToggle: onToggleLg,
    onClose: onCloseLg
  } = useControllable();
  return <>
            <Switch isChecked={isOpenSm} onChangeValue={onToggleSm} size="sm">
                Show Small Action Bar
            </Switch>
            <ActionBar.Root isOpen={isOpenSm} onClose={onCloseSm} size="sm">
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>2 selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button color="error" size="sm" variant="outline">
                        Delete
                    </Button>
                    <ActionBar.CloseTrigger size="sm" />
                </ActionBar.Content>
            </ActionBar.Root>

            <Switch isChecked={isOpenMd} onChangeValue={onToggleMd} size="sm">
                Show Medium Action Bar
            </Switch>
            <ActionBar.Root isOpen={isOpenMd} onClose={onCloseMd} size="md">
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>2 selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button color="error" size="md" variant="outline">
                        Delete
                    </Button>
                    <ActionBar.CloseTrigger size="md" />
                </ActionBar.Content>
            </ActionBar.Root>

            <Switch isChecked={isOpenLg} onChangeValue={onToggleLg} size="sm">
                Show Large Action Bar
            </Switch>
            <ActionBar.Root isOpen={isOpenLg} onClose={onCloseLg} size="lg">
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>2 selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button color="error" size="lg" variant="outline">
                        Delete
                    </Button>
                    <ActionBar.CloseTrigger size="lg" />
                </ActionBar.Content>
            </ActionBar.Root>
        </>;
}`,...v.parameters?.docs?.source}}},x=[`Base`,`WithClose`,`MultipleActions`,`Sizes`]}))();export{h as Base,_ as MultipleActions,v as Sizes,g as WithClose,x as __namedExportsOrder,b as default};