import avatarMei from "@/assets/avatar-mei.jpg";
import avatarRafael from "@/assets/avatar-rafael.jpg";
import avatarIngrid from "@/assets/avatar-ingrid.jpg";
import avatarJasper from "@/assets/avatar-jasper.jpg";

export interface Reaction {
  label: string;
  count: number;
  color: "yellow" | "pink" | "green";
}

export interface ThreadMessage {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
  reactions?: Reaction[];
}

export interface ChatMessage {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
  reactions?: Reaction[];
  threadMessages?: ThreadMessage[];
}

export interface DateGroup {
  label: string;
  messages: ChatMessage[];
}

export interface Conversation {
  id: string;
  type: "channel" | "dm";
  name: string;
  description?: string;
  memberCount?: number;
  dateGroups: DateGroup[];
}

export interface SidebarChannel {
  name: string;
  unread?: number;
}

export interface SidebarDM {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
  isSelf?: boolean;
}

export const CURRENT_USER = {
  name: "Jasper Lane",
  avatar: avatarJasper,
};

export const sidebarChannels: SidebarChannel[] = [
  { name: "general", unread: 3 },
  { name: "announcements" },
  { name: "reports" },
];

export const sidebarDMs: SidebarDM[] = [
  { id: "dm-mei", name: "Mei Tanaka", avatar: avatarMei, online: true },
  { id: "dm-rafael", name: "Rafael Oliveira", avatar: avatarRafael, online: true },
  { id: "dm-ingrid", name: "Ingrid Solberg", avatar: avatarIngrid },
  { id: "dm-jasper", name: "Jasper Lane (you)", avatar: avatarJasper, online: true, isSelf: true },
];

function now() {
  const d = new Date();
  const h = d.getHours() % 12 || 12;
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = d.getHours() >= 12 ? "PM" : "AM";
  return `${h}:${m} ${ampm}`;
}

export const initialConversations: Record<string, Conversation> = {
  "channel-general": {
    id: "channel-general",
    type: "channel",
    name: "general",
    description: "Company-wide announcements and work-based matters",
    memberCount: 24,
    dateGroups: [
      {
        label: "Monday, April 14th",
        messages: [
          {
            id: "g1",
            author: "Mei Tanaka",
            avatar: avatarMei,
            time: "9:15 AM",
            text: "Good morning everyone! Quick reminder — the Q2 planning doc is due by end of week. Please add your team's priorities when you get a chance.",
            reactions: [{ label: "👍", count: 4, color: "yellow" }],
            threadMessages: [
              { id: "g1t1", author: "Rafael Oliveira", avatar: avatarRafael, time: "9:22 AM", text: "Thanks Mei, I've already started filling in the LATAM section. Should have it done by Wednesday." },
              { id: "g1t2", author: "Ingrid Solberg", avatar: avatarIngrid, time: "9:30 AM", text: "Same here — Nordic team priorities are drafted. Will finalize after our sync today." },
              { id: "g1t3", author: "Jasper Lane", avatar: avatarJasper, time: "9:45 AM", text: "I'll coordinate with engineering. We have a few dependencies to flag." },
            ],
          },
          {
            id: "g2",
            author: "Rafael Oliveira",
            avatar: avatarRafael,
            time: "10:40 AM",
            text: "Has anyone had issues with the new VPN setup? I've been getting timeouts when connecting from São Paulo.",
            reactions: [{ label: "👀", count: 2, color: "pink" }],
            threadMessages: [
              { id: "g2t1", author: "Mei Tanaka", avatar: avatarMei, time: "10:52 AM", text: "No issues from Tokyo, but I heard the APAC gateway was updated last night. Maybe try the EU endpoint?" },
              { id: "g2t2", author: "Jasper Lane", avatar: avatarJasper, time: "11:05 AM", text: "I'll flag it with IT. They pushed a config change yesterday that might be related." },
            ],
          },
          {
            id: "g3",
            author: "Ingrid Solberg",
            avatar: avatarIngrid,
            time: "2:10 PM",
            text: "Just shared the customer feedback summary from last sprint in #reports. Some really encouraging NPS trends. 📊",
          },
        ],
      },
    ],
  },
  "channel-announcements": {
    id: "channel-announcements",
    type: "channel",
    name: "announcements",
    description: "Official company announcements",
    memberCount: 24,
    dateGroups: [
      {
        label: "Friday, April 11th",
        messages: [
          {
            id: "a1",
            author: "Ingrid Solberg",
            avatar: avatarIngrid,
            time: "10:00 AM",
            text: "🎉 Excited to announce that we've closed our Series B! Thank you to every single person on this team — your hard work made this possible. More details coming at the all-hands on Monday.",
            reactions: [
              { label: "🎉", count: 18, color: "yellow" },
              { label: "❤️", count: 12, color: "pink" },
            ],
            threadMessages: [
              { id: "a1t1", author: "Rafael Oliveira", avatar: avatarRafael, time: "10:05 AM", text: "This is incredible!! Congrats to the whole team 🙌" },
              { id: "a1t2", author: "Mei Tanaka", avatar: avatarMei, time: "10:08 AM", text: "Amazing news! Can't wait for the all-hands." },
              { id: "a1t3", author: "Jasper Lane", avatar: avatarJasper, time: "10:15 AM", text: "Well deserved. The engineering sprint this quarter really paid off." },
            ],
          },
        ],
      },
      {
        label: "Monday, April 14th",
        messages: [
          {
            id: "a2",
            author: "Mei Tanaka",
            avatar: avatarMei,
            time: "9:00 AM",
            text: "📅 Reminder: All-hands meeting today at 4:00 PM UTC. Agenda includes Series B details, Q2 roadmap preview, and a quick team shoutout segment. See you there!",
            reactions: [{ label: "✅", count: 8, color: "green" }],
          },
        ],
      },
    ],
  },
  "channel-reports": {
    id: "channel-reports",
    type: "channel",
    name: "reports",
    description: "Weekly reports and metrics",
    memberCount: 18,
    dateGroups: [
      {
        label: "Monday, April 14th",
        messages: [
          {
            id: "r1",
            author: "Ingrid Solberg",
            avatar: avatarIngrid,
            time: "2:00 PM",
            text: "Here's the customer feedback summary from Sprint 14:\n\n• NPS score: 72 → 78 (+6 pts)\n• Support ticket volume: down 12% week-over-week\n• Top feature request: bulk export for dashboards\n• Most praised: new onboarding flow (mentioned 23 times)\n\nFull doc linked in the thread below.",
            reactions: [
              { label: "📊", count: 5, color: "yellow" },
              { label: "🔥", count: 3, color: "pink" },
            ],
            threadMessages: [
              { id: "r1t1", author: "Rafael Oliveira", avatar: avatarRafael, time: "2:15 PM", text: "Great to see NPS climbing! The LATAM region alone jumped 10 points — the localization work is paying off." },
              { id: "r1t2", author: "Jasper Lane", avatar: avatarJasper, time: "2:30 PM", text: "Bulk export is on our radar for Q2. I'll bump the priority based on this feedback." },
            ],
          },
          {
            id: "r2",
            author: "Rafael Oliveira",
            avatar: avatarRafael,
            time: "3:45 PM",
            text: "Weekly engineering velocity report:\n\n• Velocity: 42 story points (target: 38)\n• Sprint completion: 94%\n• Bugs closed: 17\n• Tech debt items addressed: 4\n\nSolid week. Let's keep the momentum going! 💪",
            reactions: [{ label: "💪", count: 6, color: "green" }],
          },
        ],
      },
    ],
  },
  "dm-mei": {
    id: "dm-mei",
    type: "dm",
    name: "Mei Tanaka",
    dateGroups: [
      {
        label: "Monday, April 14th",
        messages: [
          {
            id: "dm1-1",
            author: "Mei Tanaka",
            avatar: avatarMei,
            time: "11:20 AM",
            text: "Hey Jasper! Do you have the latest API docs for the analytics module? I need to review them before our sync with the Tokyo team tomorrow.",
          },
          {
            id: "dm1-2",
            author: "Jasper Lane",
            avatar: avatarJasper,
            time: "11:25 AM",
            text: "Hey Mei! Yes, I just pushed the updated docs to Confluence this morning. I'll send you the direct link.",
          },
          {
            id: "dm1-3",
            author: "Mei Tanaka",
            avatar: avatarMei,
            time: "11:27 AM",
            text: "Perfect, thank you! Also, are we still on for the design review at 3 PM?",
          },
          {
            id: "dm1-4",
            author: "Jasper Lane",
            avatar: avatarJasper,
            time: "11:30 AM",
            text: "Absolutely. I've prepared the mockups. Ingrid is joining too — she had some feedback on the Nordic dashboard layout.",
          },
        ],
      },
    ],
  },
  "dm-rafael": {
    id: "dm-rafael",
    type: "dm",
    name: "Rafael Oliveira",
    dateGroups: [
      {
        label: "Monday, April 14th",
        messages: [
          {
            id: "dm2-1",
            author: "Rafael Oliveira",
            avatar: avatarRafael,
            time: "1:15 PM",
            text: "Jasper, quick question — are we deploying the hotfix for the payment gateway today or waiting until Wednesday?",
          },
          {
            id: "dm2-2",
            author: "Jasper Lane",
            avatar: avatarJasper,
            time: "1:20 PM",
            text: "Let's push it today. The LATAM merchants have been affected since Friday and we don't want to leave it over another day.",
          },
          {
            id: "dm2-3",
            author: "Rafael Oliveira",
            avatar: avatarRafael,
            time: "1:22 PM",
            text: "Agreed. I'll coordinate with DevOps. Can you approve the PR when you get a chance? It's #4821.",
          },
          {
            id: "dm2-4",
            author: "Jasper Lane",
            avatar: avatarJasper,
            time: "1:25 PM",
            text: "On it now. I'll review and approve within the hour. 👍",
          },
        ],
      },
    ],
  },
  "dm-ingrid": {
    id: "dm-ingrid",
    type: "dm",
    name: "Ingrid Solberg",
    dateGroups: [
      {
        label: "Friday, April 11th",
        messages: [
          {
            id: "dm3-1",
            author: "Ingrid Solberg",
            avatar: avatarIngrid,
            time: "4:30 PM",
            text: "Hi Jasper! I just finished compiling the customer feedback from the Nordic region. Some really interesting patterns emerging around the onboarding flow.",
          },
          {
            id: "dm3-2",
            author: "Jasper Lane",
            avatar: avatarJasper,
            time: "4:35 PM",
            text: "Oh nice! That aligns with what we've been seeing globally. Can you share the highlights? I'd love to reference them in Monday's planning.",
          },
          {
            id: "dm3-3",
            author: "Ingrid Solberg",
            avatar: avatarIngrid,
            time: "4:40 PM",
            text: "Sure! Main takeaways:\n• 85% completion rate on the new onboarding (up from 62%)\n• Users love the progress indicators\n• Main drop-off point is the team invite step — we should simplify that",
          },
          {
            id: "dm3-4",
            author: "Jasper Lane",
            avatar: avatarJasper,
            time: "4:45 PM",
            text: "This is gold, Ingrid. I'll add the team invite simplification to our Q2 backlog. Let's discuss at the design review next week.",
          },
        ],
      },
    ],
  },
  "dm-jasper": {
    id: "dm-jasper",
    type: "dm",
    name: "Jasper Lane (you)",
    dateGroups: [
      {
        label: "Monday, April 14th",
        messages: [
          {
            id: "dmj-1",
            author: "Jasper Lane",
            avatar: avatarJasper,
            time: "8:30 AM",
            text: "📝 Today's to-do:\n• Review Rafael's PR #4821\n• Prepare mockups for 3 PM design review\n• Update Q2 planning doc with engineering priorities\n• Follow up on VPN issue with IT",
          },
          {
            id: "dmj-2",
            author: "Jasper Lane",
            avatar: avatarJasper,
            time: "12:00 PM",
            text: "Note to self: Ingrid's Nordic feedback data is really strong. Use the onboarding completion stats in the all-hands presentation.",
          },
        ],
      },
    ],
  },
};
