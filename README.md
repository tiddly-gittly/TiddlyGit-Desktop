# Singlebox [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

|macOS|Linux|Windows|
|---|---|---|
|[![Travis Build Status](https://travis-ci.com/quanglam2807/singlebox.svg?branch=master)](https://travis-ci.com/quanglam2807/singlebox)|[![Travis Build Status](https://travis-ci.com/quanglam2807/singlebox.svg?branch=master)](https://travis-ci.com/quanglam2807/singlebox)|[![Build status](https://ci.appveyor.com/api/projects/status/nwbv85xdiq1s69pj?svg=true)](https://ci.appveyor.com/project/quanglam2807/singlebox)|

**[Singlebox](https://singleboxapp.com)** - All Your Apps in One Single Window.

---

## Notes
**Singlebox is open-source but not free.** You can add up to two apps/workspaces for free. [Pay just $9.99](https://webcatalog.onfastspring.com/singlebox/singleboxapp) to add as many as you need.

Singlebox has permanent licenses, which have no time limit. In other words, the license never expires and works with all versions (including major updates). Also, your license permits you to use the app on all of the devices you own, as long as you are the only one using the app.

---

## Development
```
# First, clone the project:
git clone https://github.com/quanglam2807/singlebox.git
cd singlebox

# install the dependencies
yarn
yarn template:install

# Run development mode
yarn electron-dev

# Build for production
yarn dist
```