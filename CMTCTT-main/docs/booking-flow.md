# TRMS Booking Workflow

## Overview Flowchart

```mermaid
flowchart TD
    Start([User]) --> BL[Booking List\nOverall / Upcoming / Ongoing /\nReturn Assets / Completed / Cancelled / Overdue]
    BL --> CB[Click 'Create Booking']
    CB --> S1

    subgraph CREATE ["✦ Create Booking — 4-Step Wizard"]
        S1["Step 1 · Booking Details\n───────────────────────\n① Select Program\n   SWT / CMT / CTT\n② Select Session Type\n   Standalone / Integrated\n③ Select Training Type\n   Individual / Group\n④ Select Training Mode\n   Marksmanship / Collective / Judgemental\n⑤ Select Weapons + Qty\n   SAR21, LMG, M203, GPMG, M110\n⑥ Dry Run? Yes / No"]

        S1 -->|Next| S2["Step 2 · Lane Configuration\n───────────────────────\n• View 15 lanes\n• Occupied lanes: locked (grey)\n• Toggle available lanes On / Off"]

        S2 -->|Next| S3["Step 3 · Nominal Roll\n───────────────────────\n• View trainee list\n• Add / Remove trainees\n• Upload via CSV\n• Search trainees"]

        S3 -->|Next| S4["Step 4 · Schedule\n───────────────────────\n• Select booking date\n• Select time slot\n• Review summary\n• Confirm & Submit"]
    end

    S4 -->|Submit| BOOKED[/"Booking Created\n#ID assigned"/]

    subgraph STATUS ["✦ Booking Status Lifecycle"]
        UPCOMING[Upcoming\nTraining date is future]
        ONGOING[Ongoing\nTraining in progress]
        ISSUE[Issue Assets\nDispatch weapons & equipment]
        RETURN[Return Assets\nCollect back weapons & equipment]
        COMPLETED[Completed\nAll assets returned]
        CANCELLED[Cancelled]
        OVERDUE[Overdue\nPast due, not completed]
    end

    BOOKED --> UPCOMING
    UPCOMING -->|Training date arrives| ONGOING
    ONGOING --> ISSUE
    ISSUE --> RETURN
    RETURN -->|All assets returned| COMPLETED
    UPCOMING -->|Admin cancels| CANCELLED
    ONGOING -->|Admin cancels| CANCELLED
    UPCOMING -->|Deadline passed| OVERDUE
    ONGOING -->|Deadline passed| OVERDUE

    OVERDUE -.->|Reissue from\nanother booking| RETURN

    style CREATE fill:#fdf2f2,stroke:#7A1515,stroke-width:1.5px,color:#000
    style STATUS fill:#f0f4ff,stroke:#1a3a6b,stroke-width:1.5px,color:#000
    style BOOKED fill:#7A1515,color:#fff,stroke:#7A1515
    style UPCOMING fill:#e0f2fe,stroke:#0369a1,color:#0c4a6e
    style ONGOING fill:#fef3c7,stroke:#d97706,color:#78350f
    style ISSUE fill:#ede9fe,stroke:#7c3aed,color:#4c1d95
    style RETURN fill:#fce7f3,stroke:#db2777,color:#831843
    style COMPLETED fill:#dcfce7,stroke:#16a34a,color:#14532d
    style CANCELLED fill:#f3f4f6,stroke:#9ca3af,color:#374151
    style OVERDUE fill:#fee2e2,stroke:#dc2626,color:#7f1d1d
```

---

## Step-by-Step Detail

### Step 1 — Booking Details

| Field | Options |
|---|---|
| Program | SWT · CMT · CTT |
| Session Type | Standalone · Integrated |
| Training Type | Individual · Group |
| Training Mode | Marksmanship · Collective · Judgemental |
| Weapons | SAR21 / LMG / M203 / GPMG / M110 (+ quantity each) |
| Dry Run | Yes · No |

### Step 2 — Lane Configuration

- Total lanes: **15**
- Pre-occupied lanes are **locked** (grey, cannot toggle)
- Available lanes can be toggled **On** (green) or **Off** (red)

### Step 3 — Nominal Roll

- View list of trainees with Rank, Name, NRIC, Platoon, Weapon
- Actions: **Add trainee**, **Upload CSV**, **Search**, **Delete**

### Step 4 — Schedule

- Select **date** (calendar picker)
- Select **time slot** (start → end)
- Review full booking summary
- **Submit** → booking record created with unique ID (e.g. `#260427-BK001`)

---

## Status Lifecycle

```
Upcoming ──────────────────────────────────────────────► Cancelled
   │                                                          ▲
   │ training date                                            │
   ▼                                                          │
Ongoing ──────────────────────────────────────────────────────┘
   │                                                          │
   │ training done                              deadline past─┘
   ▼
Issue Assets
   │
   ▼
Return Assets  ◄──── Reissue from another booking (Overdue path)
   │
   │ all returned
   ▼
Completed
```

| Status | Trigger |
|---|---|
| **Upcoming** | Booking submitted, training date in future |
| **Ongoing** | Training date reached |
| **Issue Assets** | Trainer initiates asset dispatch |
| **Return Assets** | Training session ends, collect equipment |
| **Completed** | All assets confirmed returned |
| **Cancelled** | Admin manually cancels (from Upcoming or Ongoing) |
| **Overdue** | Deadline passed without completion |
