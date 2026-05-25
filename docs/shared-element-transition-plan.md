# Shared Element Transition (SET) — Implementation Plan

A Tatra Mountains photo gallery: a vertically scrollable list on a white background → tap → detail screen where the same image animates smoothly into a hero, followed by title, description, and a **Go back** button.

---

## Step 0 — Define scope

**Goal:** Add one new tab with two screens in a Stack — a gallery built on `ScrollView` and a detail screen with a hero image, sample copy, and back navigation.

**Content:** Example landscape photos from the Tatra Mountains (local assets in the repo).

**Out of scope for this demo:**

- API or remote image loading
- Web support (SET works on iOS and Android only)
- Integration with other tabs (`SolarSystem`, etc.)
- Production polish — this is a pattern-learning demo

---

## Step 1 — UX concept

### Gallery screen

- **Background:** white (`#FFFFFF`)
- **Layout:** vertical `ScrollView` (not `FlatList`) — simple, readable list of landscape cards
- **Images:** Tatra Mountains example photos, one per row
- **Card styling:** generous horizontal and vertical spacing, rounded corners (`borderRadius`), so each photo feels like a distinct card on the white canvas
- **Interaction:** tap a photo → navigate to detail with Reanimated shared element transition

### Detail screen

- **Hero:** the same image, large at the top (full width)
- **Content below hero:**
  - Title (e.g. location or scene name)
  - Description — placeholder lorem ipsum text
- **Actions:** **Go back** button below the text → `router.back()` with reverse SET animation

**Detail layout:**

```
┌─────────────────────────┐
│                         │
│      HERO IMAGE         │  ← sharedTransitionTag
│                         │
├─────────────────────────┤
│  Morskie Oko            │  ← title
│                         │
│  Lorem ipsum dolor sit  │  ← description
│  amet, consectetur...   │
│                         │
│  ┌─────────────────┐    │
│  │    Go back      │    │
│  └─────────────────┘    │
└─────────────────────────┘
```

---

## Step 2 — Navigation architecture

SET requires a **native stack**. Tabs alone are not enough.

**Recommended file structure:**

```
assets/gallery/tatra/       ← landscape image files
constants/gallery.ts        ← titles, descriptions, image requires

app/(tabs)/
  _layout.tsx               ← add Gallery tab
  gallery/
    _layout.tsx             ← Stack (gallery + detail)
    index.tsx               ← ScrollView gallery
    [id].tsx                ← hero + text + Go back
```

**Flow:**

```
Tab (Gallery) → index.tsx → router.push('/gallery/morskie-oko') → [id].tsx → Go back → index.tsx
```

**Why a Stack inside a tab:** List and detail are siblings in one native stack — required for shared element transitions. Other tabs stay unchanged.

---

## Step 3 — Verify prerequisites

Most dependencies are already in place:

| Requirement | Project status |
|-------------|----------------|
| `react-native-reanimated` | ✅ `~4.1.1` |
| Reanimated import in root layout | ✅ `app/_layout.tsx` |
| `react-native-gesture-handler` | ✅ |
| `react-native-screens` | ✅ `~4.16.0` |
| Native build (not web) | Test on iOS/Android |

**Note:** `app.json` has `"newArchEnabled": true`. SET can be unstable with the New Architecture. If the animation does not work, temporarily set it to `false` and rebuild the native client.

---

## Step 4 — Assets and static data

### Image assets

Add 4–6 example Tatra landscape images under:

```
assets/gallery/tatra/
  morskie-oko.jpg
  giewont.jpg
  dolina-koscieliska.jpg
  ...
```

Use royalty-free Tatra photos (Unsplash, Wikimedia, or your own). Keep reasonable file sizes for mobile.

### Data model

Create `constants/gallery.ts`:

```ts
export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  image: number; // require() result
};

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'morskie-oko',
    title: 'Morskie Oko',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: require('../assets/gallery/tatra/morskie-oko.jpg'),
  },
  // ... more Tatra landscapes
];
```

Each item needs a **unique `id`** for routing and for `sharedTransitionTag` (e.g. `landscape-morskie-oko`).

---

## Step 5 — Stack layout for gallery

Create `app/(tabs)/gallery/_layout.tsx`:

- Import `Stack` from `expo-router`
- Set `headerShown: false`
- Use default stack animation — avoid `transparentModal` (breaks SET on iOS)

---

## Step 6 — Gallery screen (`gallery/index.tsx`)

Build the list with **`ScrollView`**, not `FlatList`.

### Structure

1. Root container: `flex: 1`, `backgroundColor: '#FFFFFF'`
2. `ScrollView` with `contentContainerStyle` padding (e.g. 16–20px horizontal, vertical gap between cards)
3. Map over `GALLERY_ITEMS` — one card per item
4. Each card: `Pressable` wrapping `Animated.Image`

### Card styling (gallery)

| Property | Suggested value |
|----------|-----------------|
| Width | `100%` of scroll content area |
| Height | ~220–260px (fixed aspect feel) |
| `borderRadius` | 12–16 |
| Margin bottom | 16–24px between cards |
| `resizeMode` | `cover` |
| Optional | light shadow or subtle border for depth on white bg |

### Shared element + navigation

```tsx
<Pressable onPress={() => router.push(`/gallery/${item.id}`)}>
  <Animated.Image
    source={item.image}
    sharedTransitionTag={`landscape-${item.id}`}
    style={styles.cardImage}
  />
</Pressable>
```

**Important:** Use the same `sharedTransitionTag` on the detail screen for the same item.

### Optional gallery header

Simple title above the scroll content, e.g. **Tatra Mountains**, dark text on white background.

---

## Step 7 — Detail screen (`gallery/[id].tsx`)

Use `ScrollView` if content might overflow on small screens; hero can stay fixed at top or scroll with content — for the demo, a single column layout is enough.

### Structure

1. Read param: `useLocalSearchParams<{ id: string }>()`
2. Resolve item from `GALLERY_ITEMS` (handle unknown `id` with fallback or redirect)
3. **Hero:** `Animated.Image` with matching tag:

   ```tsx
   sharedTransitionTag={`landscape-${id}`}
   ```

   Full width, height ~280–320px (or ~40% screen), `resizeMode: 'cover'`

4. **Text block** (padding 16–20px, dark text on white):
   - **Title:** `item.title` — larger font, semibold
   - **Description:** `item.description` — body size, lorem ipsum or short Tatra-themed copy

5. **Go back** button below the description:

   ```tsx
   <Pressable onPress={() => router.back()} style={styles.backButton}>
     <Text>Go back</Text>
   </Pressable>
   ```

   Style as a clear primary or outline button; add margin above so it is separated from the text.

### Screen background

White (`#FFFFFF`) to match the gallery and keep focus on the photo.

---

## Step 8 — Register the tab

In `app/(tabs)/_layout.tsx`, add:

```tsx
<Tabs.Screen name="gallery" options={{ title: 'Gallery' }} />
```

Expo Router picks up the nested `gallery/` stack automatically.

---

## Step 9 — (Optional) Customize the animation

Default SET duration is 500ms. To tune feel:

```tsx
import { SharedTransition } from 'react-native-reanimated';

const transition = SharedTransition.duration(400).springify();

<Animated.Image
  sharedTransitionTag={`landscape-${id}`}
  sharedTransitionStyle={transition}
  ...
/>
```

Apply the same `sharedTransitionStyle` on gallery and detail screens.

---

## Step 10 — Testing checklist

Test on a **native simulator or device** (`npx expo run:ios` / `run:android`), not web.

| Test | Expected result |
|------|-----------------|
| Gallery appearance | White background, spaced rounded image cards |
| Tap an image | Smooth Reanimated transition from card to hero |
| Detail content | Title, lorem ipsum description, **Go back** visible below text |
| **Go back** | Returns to gallery; image animates back to card position |
| Scroll gallery → tap | Animation starts from the card’s current scroll position |
| Different images | Each uses its own `sharedTransitionTag` |
| Fast double-tap | No crashes or broken navigation state |

---

## Step 11 — Troubleshooting

If the animation does not run, check in order:

1. Both screens use **`Animated.Image`** (not plain `Image`)
2. **Tags match** — e.g. `landscape-morskie-oko` on gallery and detail
3. Navigation uses the **Stack** — `router.push('/gallery/morskie-oko')`
4. Testing on **native**, not web
5. **New Architecture** — try disabling and rebuilding
6. **Hot reload** — full reload after layout changes
7. **Nested tabs** — if SET still fails, move gallery to a root-level stack under `app/_layout.tsx`

---

## Implementation order (summary)

1. Add Tatra images under `assets/gallery/tatra/`
2. `constants/gallery.ts` — items with id, title, description, image
3. `app/(tabs)/gallery/_layout.tsx` — Stack
4. `app/(tabs)/gallery/index.tsx` — white `ScrollView` gallery with rounded, spaced cards
5. `app/(tabs)/gallery/[id].tsx` — hero, title, description, **Go back**
6. `app/(tabs)/_layout.tsx` — register Gallery tab
7. Test SET on iOS/Android
8. Optionally tune `SharedTransition` and fix New Architecture issues if needed

---

## Estimated effort

~2–3 hours including sourcing/adding Tatra photos and styling the white gallery layout, plus debugging time if New Architecture affects SET.
