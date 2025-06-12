## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run web
npm run android
npm run ios
```

## Useful Commands

### Git
```bash
git status
```

```bash
git pull
```

```bash
git push
```

```bash
git checkout -b <New-Branch>
```

### Expo

```bash
npm install <pkg> 
npm expo-doctor
```

or

```bash
npx expo install <pkg> 
npx expo doctor
```

### NPM

```bash
npm run web
npm android
npm run ios
```

### EAS (Expo Application Services)

```bash
eas build -p android --profile preview
```

```bash
eas build -p ios --profile preview
eas submit -p android --latest
eas submit -p ios --latest
eas update
```

## Notes

- Make sure you have Expo CLI and EAS CLI installed globally:
    ```bash
    npm install -g expo-cli eas-cli
    ```
- For iOS builds, a Mac is required.
- Check [Expo documentation](https://docs.expo.dev/) for more details.