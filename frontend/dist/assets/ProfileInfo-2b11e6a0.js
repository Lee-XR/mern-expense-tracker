import{r as x,U as j,j as s,x as e,y as h}from"./index-a61ca939.js";const f=()=>{const{_id:n,username:r,email:i,createdAt:l}=x.useContext(j),t=c=>{const a=new Date(c),d=a.getFullYear(),o=String(a.getMonth()+1).padStart(2,"0");return`${String(a.getDate()).padStart(2,"0")} / ${o} / ${d}`};return s.jsxs("div",{className:e.profile,children:[s.jsx("img",{className:e.image,src:h}),s.jsxs("div",{className:e.info,children:[s.jsxs("div",{className:e.infoRow,children:[s.jsxs("span",{className:e.infoLabel,children:[s.jsx("span",{children:"Username"}),s.jsx("span",{children:":"})]}),s.jsx("span",{children:r})]}),s.jsxs("div",{className:e.infoRow,children:[s.jsxs("span",{className:e.infoLabel,children:[s.jsx("span",{children:"E-mail"}),s.jsx("span",{children:":"})]}),s.jsx("span",{children:i})]}),s.jsxs("div",{className:e.infoRow,children:[s.jsxs("span",{className:e.infoLabel,children:[s.jsx("span",{children:"User ID"}),s.jsx("span",{children:":"})]}),s.jsx("span",{children:n})]}),s.jsxs("div",{className:e.infoRow,children:[s.jsxs("span",{className:e.infoLabel,children:[s.jsx("span",{children:"Registered"}),s.jsx("span",{children:":"})]}),s.jsx("span",{children:t(l)})]})]})]})};export{f as default};
