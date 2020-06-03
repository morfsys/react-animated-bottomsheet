# Demo

<img src="https://media.giphy.com/media/VgZk3cpww1CxNZjh0R/source.gif" width="300" />

# Installation:

```javascript
npm install --save react-animated-bottomsheet
```

# Important

After installation, DO NOT forget to add `<div id="bottomsheet"></div>` right below `<div id="root"></div>`
in your `public/index.html` file.

# Usage

```javascript
import React from "react";
import BottomSheet from "react-animated-bottomsheet";

export default class App extends React.Component {
    state = {
        isBottomSheetVisible: false,
    };
    render() {
        return (
            <>
                <div
                    onClick={() =>
                        this.setState({ isBottomSheetVisible: true })
                    }
                >
                    Open Bottomsheet
                </div>
                <BottomSheet
                    isBottomSheetVisible={this.state.isBottomSheetVisible}
                    closeBottomSheet={() =>
                        this.setState({ isBottomSheetVisible: true })
                    }
                >
                    <div>
                        Cool Bottomsheet, right? <br /> It supports user gesture
                        too!
                    </div>
                </BottomSheet>
            </>
        );
    }
}
```

# Contribution

All PRs are welcome!

Cheers!!!
