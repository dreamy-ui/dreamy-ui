import{i as e}from"./preload-helper-CCSz8wUY.js";import{M as t,Sr as n,ei as r,i,t as a}from"./iframe-22HWPPlw.js";function o(){return(0,d.jsx)(i,{content:`I am visible on hover`,children:(0,d.jsx)(n,{w:`fit-content`,children:`Hover me`})})}function s(){return(0,d.jsxs)(t,{children:[(0,d.jsx)(i,{content:`I am visible on hover after 1000 milliseconds`,openDelay:1e3,children:(0,d.jsx)(n,{w:`fit-content`,children:`Hover me (1s open)`})}),(0,d.jsx)(i,{closeDelay:1e3,content:`I am closed after 1000 milliseconds`,children:(0,d.jsx)(n,{w:`fit-content`,children:`Hover me (1s close)`})})]})}function c(){return(0,d.jsxs)(t,{children:[(0,d.jsx)(i,{closeOnClick:!1,content:`I am not closed on click`,children:(0,d.jsx)(n,{w:`fit-content`,children:`Close on click false`})}),(0,d.jsx)(i,{closeOnPointerDown:!1,content:`I am not closed on pointer down`,children:(0,d.jsx)(n,{w:`fit-content`,children:`Close on pointer down false`})}),(0,d.jsx)(i,{closeOnEsc:!1,content:`I am not closed on esc key`,children:(0,d.jsx)(n,{w:`fit-content`,children:`Close on esc key false`})}),(0,d.jsx)(i,{closeOnScroll:!0,content:`I am closed on scroll`,children:(0,d.jsx)(n,{w:`fit-content`,children:`Close on scroll`})})]})}function l(){return(0,d.jsxs)(t,{children:[(0,d.jsx)(i,{content:`I have no arrow`,hasArrow:!1,children:(0,d.jsx)(n,{w:`fit-content`,children:`No arrow`})}),(0,d.jsx)(i,{arrowSize:15,content:`I have an arrow`,children:(0,d.jsx)(n,{w:`fit-content`,children:`Arrow size 15`})})]})}function u(){return(0,d.jsx)(i,{content:`I am rendered directly in the parent component`,disablePortal:!0,children:(0,d.jsx)(n,{w:`fit-content`,children:`Disable portal`})})}var d,f,p;e((()=>{a(),d=r(),f={title:`Tooltip`},o.__docgenInfo={description:``,methods:[],displayName:`Base`},s.__docgenInfo={description:``,methods:[],displayName:`OpenCloseDelay`},c.__docgenInfo={description:``,methods:[],displayName:`CloseHandlers`},l.__docgenInfo={description:``,methods:[],displayName:`Arrow`},u.__docgenInfo={description:``,methods:[],displayName:`DisablePortal`},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`function Base() {
  return <Tooltip content="I am visible on hover">
            <Text w="fit-content">Hover me</Text>
        </Tooltip>;
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`function OpenCloseDelay() {
  return <HStack>
            <Tooltip content="I am visible on hover after 1000 milliseconds" openDelay={1000}>
                <Text w="fit-content">Hover me (1s open)</Text>
            </Tooltip>
            <Tooltip closeDelay={1000} content="I am closed after 1000 milliseconds">
                <Text w="fit-content">Hover me (1s close)</Text>
            </Tooltip>
        </HStack>;
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`function CloseHandlers() {
  return <HStack>
            <Tooltip closeOnClick={false} content="I am not closed on click">
                <Text w="fit-content">Close on click false</Text>
            </Tooltip>
            <Tooltip closeOnPointerDown={false} content="I am not closed on pointer down">
                <Text w="fit-content">Close on pointer down false</Text>
            </Tooltip>
            <Tooltip closeOnEsc={false} content="I am not closed on esc key">
                <Text w="fit-content">Close on esc key false</Text>
            </Tooltip>
            <Tooltip closeOnScroll content="I am closed on scroll">
                <Text w="fit-content">Close on scroll</Text>
            </Tooltip>
        </HStack>;
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`function Arrow() {
  return <HStack>
            <Tooltip content="I have no arrow" hasArrow={false}>
                <Text w="fit-content">No arrow</Text>
            </Tooltip>
            <Tooltip arrowSize={15} content="I have an arrow">
                <Text w="fit-content">Arrow size 15</Text>
            </Tooltip>
        </HStack>;
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`function DisablePortal() {
  return <Tooltip content="I am rendered directly in the parent component" disablePortal>
            <Text w="fit-content">Disable portal</Text>
        </Tooltip>;
}`,...u.parameters?.docs?.source}}},p=[`Base`,`OpenCloseDelay`,`CloseHandlers`,`Arrow`,`DisablePortal`]}))();export{l as Arrow,o as Base,c as CloseHandlers,u as DisablePortal,s as OpenCloseDelay,p as __namedExportsOrder,f as default};