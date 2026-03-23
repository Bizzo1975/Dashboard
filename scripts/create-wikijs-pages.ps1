<#
.SYNOPSIS
  Creates the 3 required Kecktech WikiJS pages via GraphQL API.

.DESCRIPTION
  Requires a WikiJS API token. Generate one in WikiJS Admin → API Access → New API Key.
  Run with: .\create-wikijs-pages.ps1 -ApiKey "your-api-key"
  Or set env var: $env:WIKIJS_API_KEY = "your-api-key"

.PARAMETER ApiKey
  WikiJS API key (or set WIKIJS_API_KEY environment variable).

.PARAMETER WikiUrl
  Base URL of WikiJS instance. Default: http://wiki-app:3000 (Docker internal).
  For external access use: https://wiki.kecktech.net
#>

param(
    [string]$ApiKey = $env:WIKIJS_API_KEY,
    [string]$WikiUrl = "http://localhost:3000"
)

if (-not $ApiKey) {
    Write-Error "WikiJS API key required. Pass -ApiKey or set `$env:WIKIJS_API_KEY"
    exit 1
}

$Headers = @{
    Authorization  = "Bearer $ApiKey"
    "Content-Type" = "application/json"
}

$Pages = @(
    @{
        path        = "what-is-managed-it"
        title       = "What Is Managed IT?"
        description = "Plain-language guide to managed IT services for small and mid-size businesses."
        content     = @"
# What Is Managed IT?

Running a business is hard enough without worrying about your computers, network, and security.
That's where **managed IT** comes in.

## The Simple Version

Managed IT means you pay a flat monthly fee and a team of IT professionals handles everything technology-related for your business — proactively, not just when something breaks.

Think of it like a lease on a car: predictable cost, someone else handles the maintenance, and you always have a reliable vehicle.

## What's Included

With Kecktech's Managed IT (MSP) plan, you get:

- **24/7 monitoring** — We watch your computers and network around the clock.
- **Remote support** — Most issues fixed remotely in minutes, without waiting for a technician.
- **Security patching** — Windows and software updates applied automatically, so you're protected.
- **Antivirus and threat monitoring** — Real-time defense against ransomware and malware.
- **Backup oversight** — We verify your backups actually work, every day.
- **Help desk access** — Call or email when something goes wrong. A real person answers.

## Why Not Just Call IT When Something Breaks?

**Break-fix IT** (paying per incident) feels cheaper at first. But one server failure or ransomware attack can cost thousands — or shut down your business entirely.

Managed IT prevents most of those problems before they happen. It's like the difference between going to the doctor for regular checkups versus only going to the emergency room.

## Is It Right for Your Business?

If you answer yes to any of these, managed IT is worth a conversation:

- Do you have more than 3 computers or employees who rely on technology daily?
- Have you ever lost data, had a virus, or had systems go down during business hours?
- Do you worry about whether your backups work?
- Does your current IT situation feel reactive instead of proactive?

## How Much Does It Cost?

Kecktech offers flat-rate plans starting at **$79/month per device** — no surprise invoices.

[Contact us](/contact) to get a free assessment of your current setup.
"@
        tags        = @("managed-it", "msp", "services", "overview")
    },
    @{
        path        = "ai-custom-apps"
        title       = "Custom AI Apps for Your Business"
        description = "How Kecktech builds practical AI-powered tools tailored to your specific workflows."
        content     = @"
# Custom AI Apps for Your Business

AI isn't just for large corporations anymore. Kecktech builds practical, affordable AI-powered tools
designed around the specific ways your business actually works.

## What We Build

We don't sell generic software. We build tools that solve your exact problem:

- **Document processors** — Automatically extract data from invoices, contracts, or forms into your spreadsheets or systems.
- **Customer response assistants** — Draft email replies, quotes, or follow-ups based on your templates and tone.
- **Internal search tools** — Ask questions about your own files, manuals, or policies in plain English.
- **Workflow automation** — Connect your tools so repetitive tasks happen automatically, without manual steps.
- **Reporting dashboards** — Pull data from multiple sources into one simple view you can check in seconds.

## Plain Language, Not Jargon

We explain what we're building before we build it. If we can't describe how your tool works in plain terms,
we don't build it. No black boxes.

## How the Process Works

1. **Discovery call** — We learn your workflow and identify where AI can actually help (not just where it sounds impressive).
2. **Proposal** — You get a written description of what we'll build, what it will do, and what it will cost. No surprises.
3. **Build and test** — We build a working prototype and test it with your real data.
4. **Deploy and train** — We set it up in your environment and walk your team through using it.
5. **Ongoing support** — Included in your managed IT plan if you're an existing client.

## What AI Can't Do (Honest Answer)

AI tools work best on well-defined, repetitive tasks. They are not:

- A replacement for human judgment on complex decisions
- A magic solution to poorly defined processes
- Reliable for anything requiring perfect accuracy without review

We'll tell you honestly if AI isn't the right fit for a given problem.

## Pricing

Custom AI projects start at a one-time build fee based on scope, with optional monthly maintenance.
Existing MSP clients get a discount on custom work.

[Contact us](/contact) to describe what you're trying to automate.
"@
        tags        = @("ai", "automation", "custom-apps", "services")
    },
    @{
        path        = "your-private-hosting"
        title       = "Your Private Hosting"
        description = "Sovereign, self-hosted infrastructure for businesses that want to own their data."
        content     = @"
# Your Private Hosting

Most businesses rent their software from large cloud providers. That means your files, emails,
customer data, and internal tools live on servers you don't control, in data centers you'll never see,
governed by terms of service that can change at any time.

Kecktech offers an alternative: **private hosting on infrastructure you own**.

## What "Private Hosting" Means

We set up your business tools — email, file storage, project management, internal wiki, and more —
on a dedicated server at your location or a co-location facility you control.

Your data never leaves your building (or your chosen facility). No vendor can read it, sell it,
lose access to it, or shut down your account.

## What's Included

| Service | Description |
|---------|-------------|
| **Business email** | Full email server with spam filtering, webmail, and mobile sync |
| **File storage** | Shared drives accessible from any device, like your own Google Drive |
| **Password manager** | Secure vault for team credentials, accessible only to your staff |
| **Internal wiki** | Company knowledge base for procedures, contacts, and documentation |
| **IT dashboard** | Live view of your systems, alerts, and service status |

## Who Is This For?

Private hosting is a good fit if you:

- Handle sensitive client data (legal, medical, financial, or government)
- Have had concerns about data sovereignty or vendor lock-in
- Want predictable costs without per-user pricing that scales up every year
- Have experienced a cloud provider outage that stopped your business

## What About Backups and Reliability?

We configure automated encrypted backups to a second location. Your data exists in at least two places at all times.

We also monitor your server 24/7 as part of the managed IT plan. If something fails, we know before you do.

## Honest Trade-Offs

Private hosting is not free. It requires hardware investment upfront and ongoing maintenance.
It's also not right for every business — if you have no IT concerns and value pure convenience,
a standard cloud setup may serve you fine.

We'll give you an honest assessment of whether private hosting makes sense for your situation.

## Getting Started

A private hosting setup typically takes 2--4 weeks from contract to go-live.

[Contact us](/contact) to schedule a no-pressure consultation.
"@
        tags        = @("hosting", "private", "self-hosted", "infrastructure", "sovereignty")
    }
)

$Mutation = @"
mutation CreatePage(`$content: String!, `$description: String!, `$path: String!, `$title: String!, `$tags: [String]!) {
  pages {
    create(
      content: `$content
      description: `$description
      editor: "markdown"
      isPublished: true
      isPrivate: false
      locale: "en"
      path: `$path
      tags: `$tags
      title: `$title
    ) {
      responseResult {
        succeeded
        errorCode
        slug
        message
      }
      page {
        id
        path
        title
      }
    }
  }
}
"@

$Created = 0
$Failed  = 0

foreach ($page in $Pages) {
    Write-Host "`nCreating: $($page.path) ..." -ForegroundColor Cyan

    $Body = @{
        query     = $Mutation
        variables = @{
            content     = $page.content
            description = $page.description
            path        = $page.path
            title       = $page.title
            tags        = $page.tags
        }
    } | ConvertTo-Json -Depth 10

    try {
        $Response = Invoke-RestMethod -Uri "$WikiUrl/graphql" -Method Post -Headers $Headers -Body $Body -ErrorAction Stop
        $Result   = $Response.data.pages.create.responseResult

        if ($Result.succeeded) {
            $Id = $Response.data.pages.create.page.id
            Write-Host "  OK — page id $Id at /en/$($page.path)" -ForegroundColor Green
            $Created++
        } else {
            Write-Warning "  FAILED: [$($Result.errorCode)] $($Result.message)"
            $Failed++
        }
    } catch {
        Write-Warning "  HTTP error: $_"
        $Failed++
    }
}

Write-Host "`n--- Done: $Created created, $Failed failed ---"
if ($Failed -gt 0) { exit 1 }
