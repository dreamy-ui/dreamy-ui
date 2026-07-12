import{c as e,i as t}from"./preload-helper-CCSz8wUY.js";import{t as n}from"./react-DaLZQZrY.js";import{An as r,B as i,H as a,J as o,Jt as s,Kt as c,P as l,S as u,U as d,V as f,X as p,Xt as m,Y as h,Yt as g,Zt as _,ei as v,it as y,nn as b,o as x,qt as S,t as C,tn as w,vr as T}from"./iframe-22HWPPlw.js";function E(){let[e,t]=(0,A.useState)(null);function n(e){e.preventDefault();let n=new FormData(e.currentTarget),r={};n.forEach((e,t)=>{r[t]=String(e)}),t(r)}return(0,j.jsxs)(`form`,{autoComplete:`on`,"data-testid":`autocomplete-form`,id:`profile-form`,onSubmit:n,children:[(0,j.jsxs)(_,{children:[(0,j.jsxs)(s,{children:[(0,j.jsx)(m,{children:`Profile`}),(0,j.jsx)(g,{children:`Fill in your profile details`})]}),(0,j.jsx)(c,{children:(0,j.jsxs)(l,{align:`stretch`,gap:4,children:[(0,j.jsxs)(b,{id:`given-name-field`,children:[(0,j.jsx)(w,{"data-testid":`given-name-label`,children:`First name`}),(0,j.jsx)(T,{autoComplete:`given-name`,"data-testid":`given-name-input`,name:`given-name`,placeholder:`John`})]}),(0,j.jsxs)(b,{id:`family-name-field`,children:[(0,j.jsx)(w,{"data-testid":`family-name-label`,children:`Last name`}),(0,j.jsx)(T,{autoComplete:`family-name`,"data-testid":`family-name-input`,name:`family-name`,placeholder:`Doe`})]}),(0,j.jsxs)(b,{id:`email-field`,children:[(0,j.jsx)(w,{"data-testid":`email-label`,children:`Email`}),(0,j.jsx)(T,{autoComplete:`email`,"data-testid":`email-input`,name:`email`,placeholder:`john@example.com`,type:`email`})]}),(0,j.jsxs)(b,{id:`country-field`,children:[(0,j.jsx)(w,{"data-testid":`country-label`,children:`Country`}),(0,j.jsxs)(h,{autoComplete:`country`,"data-testid":`country-select`,hiddenSelectProps:{"data-testid":`country-hidden-select`},items:N,name:`country`,width:`full`,children:[(0,j.jsx)(p,{"data-testid":`country-trigger`,placeholder:`Select country`}),(0,j.jsx)(o,{})]})]}),(0,j.jsxs)(b,{id:`bio-field`,children:[(0,j.jsx)(w,{"data-testid":`bio-label`,children:`Bio`}),(0,j.jsx)(x,{autoComplete:`off`,"data-testid":`bio-textarea`,name:`bio`,placeholder:`Tell us about yourself`})]})]})}),(0,j.jsx)(S,{children:(0,j.jsx)(`button`,{"data-testid":`submit-button`,type:`submit`,children:`Submit`})})]}),e&&(0,j.jsx)(`pre`,{"data-testid":`form-output`,children:JSON.stringify(e,null,2)})]})}function D(){return(0,j.jsxs)(l,{align:`stretch`,gap:6,maxW:`md`,children:[(0,j.jsxs)(b,{id:`fruit-select-field`,children:[(0,j.jsx)(w,{"data-testid":`fruit-label`,children:`Favorite fruit`}),(0,j.jsxs)(h,{autoComplete:`on`,hiddenSelectProps:{"data-testid":`fruit-hidden-select`,"data-custom":`fruit-select`},isRequired:!0,items:P,name:`fruit`,width:`full`,children:[(0,j.jsx)(p,{"data-testid":`fruit-trigger`,placeholder:`Pick a fruit`}),(0,j.jsx)(o,{})]})]}),(0,j.jsxs)(b,{id:`newsletter-field`,children:[(0,j.jsx)(w,{"data-testid":`newsletter-label`,children:`Newsletter`}),(0,j.jsx)(r,{"data-testid":`newsletter-checkbox`,name:`newsletter`,value:`yes`,children:`Subscribe to newsletter`})]}),(0,j.jsxs)(b,{id:`notifications-field`,children:[(0,j.jsx)(w,{"data-testid":`notifications-label`,children:`Notifications`}),(0,j.jsx)(u,{"data-testid":`notifications-switch`,inputProps:{"data-testid":`notifications-hidden-input`},name:`notifications`,children:`Enable notifications`})]}),(0,j.jsxs)(b,{id:`volume-field`,children:[(0,j.jsx)(w,{"data-testid":`volume-label`,children:`Volume`}),(0,j.jsxs)(f,{defaultValue:50,inputProps:{"data-testid":`volume-hidden-input`},name:`volume`,children:[(0,j.jsx)(d,{children:(0,j.jsx)(i,{})}),(0,j.jsx)(a,{"data-testid":`volume-thumb`})]})]}),(0,j.jsxs)(b,{id:`plan-field`,children:[(0,j.jsx)(w,{"data-testid":`plan-label`,children:`Plan`}),(0,j.jsxs)(l,{align:`stretch`,children:[(0,j.jsx)(y,{"data-testid":`plan-free`,name:`plan`,value:`free`,children:`Free`}),(0,j.jsx)(y,{"data-testid":`plan-pro`,name:`plan`,value:`pro`,children:`Pro`})]})]})]})}function O(){return(0,j.jsxs)(l,{align:`stretch`,gap:4,maxW:`md`,children:[(0,j.jsxs)(b,{id:`username-field`,children:[(0,j.jsx)(w,{"data-testid":`username-label`,children:`Username`}),(0,j.jsx)(T,{"data-testid":`username-input`,placeholder:`Enter username`})]}),(0,j.jsxs)(b,{id:`role-field`,children:[(0,j.jsx)(w,{"data-testid":`role-label`,children:`Role`}),(0,j.jsxs)(h,{items:[{value:`admin`,label:`Admin`},{value:`user`,label:`User`}],width:`full`,children:[(0,j.jsx)(p,{"data-testid":`role-trigger`,placeholder:`Select role`}),(0,j.jsx)(o,{})]})]}),(0,j.jsxs)(b,{id:`terms-field`,children:[(0,j.jsx)(w,{"data-testid":`terms-label`,children:`Terms`}),(0,j.jsx)(r,{"data-testid":`terms-checkbox`,children:`Accept terms`})]})]})}function k(){let[e,t]=(0,A.useState)(``);return(0,j.jsxs)(l,{align:`stretch`,gap:4,maxW:`md`,children:[(0,j.jsxs)(b,{id:`autofill-country-field`,children:[(0,j.jsx)(w,{children:`Country (autofill simulation)`}),(0,j.jsxs)(h,{hiddenSelectProps:{"data-testid":`autofill-hidden-select`},items:N,name:`autofill-country`,onChangeValue:t,width:`full`,children:[(0,j.jsx)(p,{"data-testid":`autofill-trigger`,placeholder:`Select country`}),(0,j.jsx)(o,{})]}),(0,j.jsxs)(`select`,{"data-testid":`autofill-simulator`,onChange:e=>{let t=document.querySelector(`[data-testid="autofill-hidden-select"]`);t&&(t.value=e.target.value,t.dispatchEvent(new Event(`change`,{bubbles:!0})))},style:{marginTop:8},children:[(0,j.jsx)(`option`,{value:``,children:`Simulate autofill...`}),N.map(e=>(0,j.jsx)(`option`,{value:e.value,children:e.label},e.value))]})]}),(0,j.jsxs)(`p`,{"data-testid":`autofill-value`,children:[`Selected: `,e||`(none)`]})]})}var A,j,M,N,P,F;t((()=>{C(),A=e(n(),1),j=v(),M={title:`Form Accessibility`},N=[{value:`us`,label:`United States`},{value:`uk`,label:`United Kingdom`},{value:`pl`,label:`Poland`}],P=[{value:`apple`,label:`Apple`},{value:`banana`,label:`Banana`},{value:`orange`,label:`Orange`}],E.__docgenInfo={description:`Fieldset form with autocomplete attributes for browser autofill testing.`,methods:[],displayName:`AutocompleteForm`},D.__docgenInfo={description:`Hidden input prop forwarding for each component type.`,methods:[],displayName:`HiddenInputProps`},O.__docgenInfo={description:`Label click should focus the associated control.`,methods:[],displayName:`LabelFocus`},k.__docgenInfo={description:`Simulates browser autofill by programmatically changing the hidden select value.`,methods:[],displayName:`HiddenSelectAutofill`},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`function AutocompleteForm() {
  const [submitted, setSubmitted] = useState<Record<string, string> | null>(null);
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = String(value);
    });
    setSubmitted(data);
  }
  return <form autoComplete="on" data-testid="autocomplete-form" id="profile-form" onSubmit={handleSubmit}>
            <Fieldset.Root>
                <Fieldset.Header>
                    <Fieldset.Legend>Profile</Fieldset.Legend>
                    <Fieldset.HelperText>Fill in your profile details</Fieldset.HelperText>
                </Fieldset.Header>

                <Fieldset.Content>
                    <VStack align="stretch" gap={4}>
                        <Field.Root id="given-name-field">
                            <Field.Label data-testid="given-name-label">First name</Field.Label>
                            <Input autoComplete="given-name" data-testid="given-name-input" name="given-name" placeholder="John" />
                        </Field.Root>

                        <Field.Root id="family-name-field">
                            <Field.Label data-testid="family-name-label">Last name</Field.Label>
                            <Input autoComplete="family-name" data-testid="family-name-input" name="family-name" placeholder="Doe" />
                        </Field.Root>

                        <Field.Root id="email-field">
                            <Field.Label data-testid="email-label">Email</Field.Label>
                            <Input autoComplete="email" data-testid="email-input" name="email" placeholder="john@example.com" type="email" />
                        </Field.Root>

                        <Field.Root id="country-field">
                            <Field.Label data-testid="country-label">Country</Field.Label>
                            <Select.Root autoComplete="country" data-testid="country-select" hiddenSelectProps={{
              "data-testid": "country-hidden-select"
            }} items={countries} name="country" width="full">
                                <Select.Trigger data-testid="country-trigger" placeholder="Select country" />
                                <Select.Content />
                            </Select.Root>
                        </Field.Root>

                        <Field.Root id="bio-field">
                            <Field.Label data-testid="bio-label">Bio</Field.Label>
                            <Textarea autoComplete="off" data-testid="bio-textarea" name="bio" placeholder="Tell us about yourself" />
                        </Field.Root>
                    </VStack>
                </Fieldset.Content>

                <Fieldset.Footer>
                    <button data-testid="submit-button" type="submit">
                        Submit
                    </button>
                </Fieldset.Footer>
            </Fieldset.Root>

            {submitted && <pre data-testid="form-output">{JSON.stringify(submitted, null, 2)}</pre>}
        </form>;
}`,...E.parameters?.docs?.source},description:{story:`Fieldset form with autocomplete attributes for browser autofill testing.`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`function HiddenInputProps() {
  return <VStack align="stretch" gap={6} maxW="md">
            <Field.Root id="fruit-select-field">
                <Field.Label data-testid="fruit-label">Favorite fruit</Field.Label>
                <Select.Root autoComplete="on" hiddenSelectProps={{
        "data-testid": "fruit-hidden-select",
        "data-custom": "fruit-select"
      }} isRequired items={fruits} name="fruit" width="full">
                    <Select.Trigger data-testid="fruit-trigger" placeholder="Pick a fruit" />
                    <Select.Content />
                </Select.Root>
            </Field.Root>

            <Field.Root id="newsletter-field">
                <Field.Label data-testid="newsletter-label">Newsletter</Field.Label>
                <Checkbox data-testid="newsletter-checkbox" name="newsletter" value="yes">
                    Subscribe to newsletter
                </Checkbox>
            </Field.Root>

            <Field.Root id="notifications-field">
                <Field.Label data-testid="notifications-label">Notifications</Field.Label>
                <Switch data-testid="notifications-switch" inputProps={{
        "data-testid": "notifications-hidden-input"
      }} name="notifications">
                    Enable notifications
                </Switch>
            </Field.Root>

            <Field.Root id="volume-field">
                <Field.Label data-testid="volume-label">Volume</Field.Label>
                <Slider.Root defaultValue={50} inputProps={{
        "data-testid": "volume-hidden-input"
      }} name="volume">
                    <Slider.Track>
                        <Slider.FilledTrack />
                    </Slider.Track>
                    <Slider.Thumb data-testid="volume-thumb" />
                </Slider.Root>
            </Field.Root>

            <Field.Root id="plan-field">
                <Field.Label data-testid="plan-label">Plan</Field.Label>
                <VStack align="stretch">
                    <Radio data-testid="plan-free" name="plan" value="free">
                        Free
                    </Radio>
                    <Radio data-testid="plan-pro" name="plan" value="pro">
                        Pro
                    </Radio>
                </VStack>
            </Field.Root>
        </VStack>;
}`,...D.parameters?.docs?.source},description:{story:`Hidden input prop forwarding for each component type.`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`function LabelFocus() {
  return <VStack align="stretch" gap={4} maxW="md">
            <Field.Root id="username-field">
                <Field.Label data-testid="username-label">Username</Field.Label>
                <Input data-testid="username-input" placeholder="Enter username" />
            </Field.Root>

            <Field.Root id="role-field">
                <Field.Label data-testid="role-label">Role</Field.Label>
                <Select.Root items={[{
        value: "admin",
        label: "Admin"
      }, {
        value: "user",
        label: "User"
      }]} width="full">
                    <Select.Trigger data-testid="role-trigger" placeholder="Select role" />
                    <Select.Content />
                </Select.Root>
            </Field.Root>

            <Field.Root id="terms-field">
                <Field.Label data-testid="terms-label">Terms</Field.Label>
                <Checkbox data-testid="terms-checkbox">Accept terms</Checkbox>
            </Field.Root>
        </VStack>;
}`,...O.parameters?.docs?.source},description:{story:`Label click should focus the associated control.`,...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`function HiddenSelectAutofill() {
  const [value, setValue] = useState("");
  return <VStack align="stretch" gap={4} maxW="md">
            <Field.Root id="autofill-country-field">
                <Field.Label>Country (autofill simulation)</Field.Label>
                <Select.Root hiddenSelectProps={{
        "data-testid": "autofill-hidden-select"
      }} items={countries} name="autofill-country" onChangeValue={setValue} width="full">
                    <Select.Trigger data-testid="autofill-trigger" placeholder="Select country" />
                    <Select.Content />
                </Select.Root>
                <select data-testid="autofill-simulator" onChange={e => {
        const hidden = document.querySelector('[data-testid="autofill-hidden-select"]') as HTMLSelectElement | null;
        if (hidden) {
          hidden.value = e.target.value;
          hidden.dispatchEvent(new Event("change", {
            bubbles: true
          }));
        }
      }} style={{
        marginTop: 8
      }}>
                    <option value="">Simulate autofill...</option>
                    {countries.map(c => <option key={c.value} value={c.value}>
                            {c.label}
                        </option>)}
                </select>
            </Field.Root>

            <p data-testid="autofill-value">Selected: {value || "(none)"}</p>
        </VStack>;
}`,...k.parameters?.docs?.source},description:{story:`Simulates browser autofill by programmatically changing the hidden select value.`,...k.parameters?.docs?.description}}},F=[`AutocompleteForm`,`HiddenInputProps`,`LabelFocus`,`HiddenSelectAutofill`]}))();export{E as AutocompleteForm,D as HiddenInputProps,k as HiddenSelectAutofill,O as LabelFocus,F as __namedExportsOrder,M as default};