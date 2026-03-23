const http = require('http');
function gql(body, jwt, cb) {
  const b = JSON.stringify(body);
  const req = http.request({hostname:'localhost',port:3000,path:'/graphql',method:'POST',headers:{'Content-Type':'application/json','Authorization':jwt?'Bearer '+jwt:'','Content-Length':Buffer.byteLength(b)}}, (res) => {
    let d=''; res.on('data',c=>d+=c); res.on('end',()=>cb(JSON.parse(d)));
  });
  req.on('error',e=>console.error(e)); req.write(b); req.end();
}

const CONTENT = `# Billing & Revenue — How to Use

## What This View Shows

The Billing view aggregates all financial data from ERPNext into one dashboard.

## Sections

### KPI Cards (Top Row)
- **MRR** — Monthly Recurring Revenue from active subscriptions
- **ARR** — Annual Run Rate
- **Outstanding AR** — Total unpaid invoices
- **Unbilled Hours** — Draft timesheets not yet invoiced

### AR Aging
Invoices bucketed by how overdue they are:
- **Current** — not yet due
- **1-30 days** — follow up
- **31-60 days** — escalate
- **61+ days** — collection priority

Click any invoice number to open it in ERPNext.

### Billable Time (Timesheets)
All timesheet entries from ERPNext. Draft = not yet billed. Submitted = invoiced.

**Monthly billing process:**
1. Review all Draft entries
2. Group by customer
3. Open ERPNext and create Sales Invoice per customer
4. Submit the timesheets

### Accounts Payable
Open purchase invoices. Green = current, red = overdue.

## Common Questions

**Where do timesheets come from?**
Techs log time via the Support Desk Log Time panel. Each entry creates a Draft Timesheet in ERPNext.

**How do I invoice a customer?**
Open ERPNext at ops.kecktech.net, go to Accounting, Sales Invoice, New. Link the timesheet entries.
`;

gql({query:'mutation{authentication{login(username:"admin@kecktech.net",password:"Kecktech2026!",strategy:"local"){jwt}}}'}, null, (r) => {
  const JWT = r.data?.authentication?.login?.jwt;
  gql({
    query: 'mutation UP($c:String!,$i:Int!,$t:String!){pages{update(id:$i,content:$c,description:"",editor:"markdown",isPublished:true,isPrivate:false,locale:"en",path:"staff-guide/billing",publishEndDate:"",publishStartDate:"",scriptCss:"",scriptJs:"",tags:[],title:$t){responseResult{succeeded message}}}}',
    variables: { c: CONTENT, i: 12, t: 'Billing & Revenue - How to Use' }
  }, JWT, (r2) => {
    const res = r2.data?.pages?.update?.responseResult;
    console.log('billing update:', res?.succeeded ? 'OK' : JSON.stringify(res || r2.errors));
  });
});
