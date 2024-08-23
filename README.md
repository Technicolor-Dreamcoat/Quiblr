<h1 align="center">
  <br>
  <a href="https://quiblr.com"><img src="https://github.com/user-attachments/assets/3fd5ebf6-eb27-41cc-9b43-8be1b4c1881e" alt="Quiblr" width="200"></a>
  <br>
</h1>

<h4 align="center"><a href="http://quiblr.com" target="_blank">Quiblr</a> is an intuitive, accessible, and modern interface to connect users to the fediverse.</h4>

<p align="center">
 
<body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
    <a href='https://ko-fi.com/J3J3KBRD6' target='_blank'>
        <img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi4.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' />
    </a>
</body>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#feature-spotlight">Feature Spotlight</a> •
  <a href="#additional-features">Additional Features</a> •
  <a href="#stack">Stack</a> •
  <a href="#donate">Donate</a> •
  <a href="#contact">Contact</a> •
  <a href="#other-reads">Other Reads</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/62224971-008a-4982-a4eb-5c5fc2eb088a" alt="Preview_gif" width="80%" style="min-width: 300px; border-radius: 10px;">
</p>

## Overview
Welcome to Quiblr, the intuitive front-end that bridges the gap between users and the fediverse. Designed with accessibility in mind, Quiblr allows you to seamlessly connect with any instance on Lemmy (and, soon, other popular fediverse applications like Mastodon). Quiblr makes exploring decentralized social networks easy and engaging for everyone (not just _tech-savvy_ users 😉)

Quiblr combines the best features of mainstream social media with a more flexible and user-centric approach. Enjoy a sleek, user-friendly experience with personalized feeds, rich media support, and strong privacy, all while exploring new communities and conversations.

Whether you're looking to expand your social horizons or simply want a fresh, modern social media experience, Quiblr makes it easy and enjoyable. Jump in and find your community!


## Feature Spotlight
**🙈 For You Feed:** The For You feed is a private, on-device recommendation engine that serves more of the content that you love. No data collection. No server-side rendering. Quiblr’s novel solution uses a combination of advanced industry practices to bring you the most relevant content without ever collecting or storing your personal data. Here’s how it enhances your browsing experience:
- **On-Device Data Processing:** All recommendations are generated locally on your device. This means your interactions are analyzed in a secure way without any data ever leaving your device. By keeping all data processing on your device, Quiblr ensures that no user data is collected, stored, or shared. Your personalized recommendations are uniquely yours, created in real-time, without compromising your privacy.
- **User Interaction Signals:** Quiblr tracks various signals to understand your content preferences:
   - **Dwell Time:** Dwell time measures how long you naturally hover over or read a post as you scroll through your feed. By understanding your unique scrolling speed and reading habits, Quiblr accurately gauges your interest in different types of content
   - **Clicks and Comments:** Whenever you click, vote, or comment on a post, Quiblr adds more weight to this post's metadata (e.g. community, author, etc.) to tailor your feed to find similar content
   - **Show More/Less:** In addition to post voting, the "Show More" and "Show Less" buttons allow for _offline_ recommendation tailoring. This means that you can get a customized feed without needing to log in
- **Prevent Bubbles:** While recommendation engines are great, there is always a risk of hindering diversity of thought and content. To help mitigate this, Quiblr always mixes in other _non-currated_ posts into the For You feed. This helps you discover new content that you may not have come across before 


https://github.com/user-attachments/assets/38b16ecc-8e6e-499e-b812-645c52ac58af


**🍀 Feeling Lucky:** One of the challenges in the Fediverse is the vastness of content, which can make it difficult for users to discover new and engaging posts. Quiblr's "Feeling Lucky" button addresses this by offering a simple and enjoyable way to explore random posts, allowing you to stumble upon interesting content that you might not have encountered otherwise.

Big shoutout to [Rooki](https://quiblr.com/instance/lemmy.world/user/lemmy.world/Rooki) for this feature idea!

**📈 Post Peformance Insights:** Fediverse apps tend to lack the ability to provide the same level of visibility into how your posts are performing as mainstream social media apps. To address this, I built a [solution](https://quiblr.com/post_activity) that gives a directional sense of how _active_ your posts are. It does this by using the upvotes, downvotes, comments, and age of the post. The logic is as follows:
```
const activityScore =
    (post?.counts?.upvotes -
      post?.counts?.downvotes +
      post?.counts?.comments * 2) /
    getTimeDifferenceNoUnits(post?.post)

//return the diff between now and when the post was published (no units)
export function getTimeDifferenceNoUnits(post) {
  const postLocalTime = DateTime.fromISO(post?.published, {
    zone: "utc",
  }).toLocal();
  const currentTime = DateTime.local();

  const timeDiffInMinutes = Math.floor(
    currentTime.diff(postLocalTime, "minutes").minutes
  );
  return timeDiffInMinutes;
}
```
As you can see in the logic above, upvotes and downvotes are weighted equally while comments are twice the weight. Additionally, the _activity score_ is pulled down as more time passes. Again, this is directional but it gives you a sense of how your posts are doing.

**👯 Remove Duplicate Posts:** One of the biggest gripes about the Lemmy experience is the duplicate posts (as the result of similar communities across multiple servers). Quiblr's solution for this is to provide an option to remove posts that have the **same title** and are from the **same author**. This way, the first duplicate post is kept in the feed and the others are removed.

**📢 Text to Speech:** Being a relatively young technology, fediverse apps unfortunately tend to be inaccessible. Accessibility has been a particular focus for me and one of the most recent features I added is text to speech, a simple solution that reads posts (in any language) out loud. The solution consists of 2 steps: 1) determine the language of the post and 2) convert from text to speech.
1. **Determining Language:** To determine the language of a post, I tested various solutions. I knew I wanted a lighter solution and I found that [Eld](https://github.com/nitotm/efficient-language-detector-js) fit the bill. Its speed and accuracy was better than anything else I tested 💨
2. **Text-to-speech:**  Once I had Eld setup, I was a bit stuck in finding the best solution to do text-to-speech efficiently but then I discovered Expo's Speech component. [Expo Speech](https://docs.expo.dev/versions/latest/sdk/speech/) is a simple solution that is customizable enough to handle various language and voice options. I may revisit this solution again in the future as text-to-speech tech continues to develop. In the meantime, it gets the job done!

## Additional Features
- 𝍀 4 different feed formats (card, narrow, compact, masonry)
- 💬 Direct messaging
- 🌝 Dark mode (including device settings)
- 📖 Dyslexia-friendly font settings
- 🔠 Font size adjustment
- 📜 Infinite scroll
- ↕️ Collapse comment threads
- 🔖 Save and share posts
- 🗂️ Open posts in separate tabs
- ❎ Hide and/or blur nsfw content
- 🧑‍💻 Browse any instance
- 🔎 Search suggestions
- ✉️ Email notifications
- 📲 PWA
- ⚙️ Customization features (scroll bars, vote arrow customization)

## Stack
- [React Native](https://reactnative.dev) - Cross-platform framework
- [Expo](https://github.com/expo/expo) - Tools and services to build, deploy, and manage React Native
- [React Navigation](https://reactnavigation.org) - Flexible and easy-to-use solution for managing navigation and routing
- [Tabler](https://github.com/tabler/tabler-icons) - A vast library a beautiful icons
- [Eld](https://github.com/nitotm/efficient-language-detector-js) - A fast and accurate language detector

## Donate
Quiblr is a labor of love, a passion project that I dedicate my evenings to. If you enjoy using Quiblr, consider buying me a coffee to support its continued development!

<a href='https://ko-fi.com/J3J3KBRD6' target='_blank'>
        <img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi4.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' />
    </a>

## Contact
Do you have questions, feedback, or just want to get in touch? Use the [Quiblr feedback form](https://quiblr.com/feedback). I check it pretty regularly 😇

## Other Reads
- [Quiblr - The Fediverse and YOU!](https://quiblr.com/the_fediverse_and_you)
- [TechCrunch - Why Meta is looking to the fediverse as the future for social media](https://techcrunch.com/2024/04/25/why-meta-is-looking-to-the-fediverse-as-the-future-for-social-media/)
- [Flipboard - Flipboard Begins to Federate](https://about.flipboard.com/inside-flipboard/flipboard-begins-to-federate/)
- [Ghost - It’s time to bring back the open web](https://activitypub.ghost.org/)

## License
- GNU Affero General Public License v3.0
  
## Closing Words
Just a heads-up, Quiblr's internal development often takes a different path from the main open-source repo. I juggle a bunch of feature branches behind the scenes, which makes keeping everything tidy in one big repo a bit of a challenge. I've done my best to pull together a single, working repo for the community to build on and use!

<p align="center">
Made with ☕️ in NYC
</p>
