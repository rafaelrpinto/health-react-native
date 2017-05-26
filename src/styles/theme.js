import {PixelRatio} from 'react-native';

/**
 * Basic color pallet of the app.
 * @type {String}
 */
const theme = {
  color: {
    light: '#DEE5EA',
    regular: '#1B4964',
    dark: '#093854'
  },
  font: {
    bold: {
      fontFamily: 'OleoScript',
      fontWeight: 'bold'
    },
    regular: {
      fontFamily: 'OleoScript',
      fontWeight: '400'
    }
  }
};

// default text styles
theme.text = {
  header: {
    ...theme.font.bold,
    color: theme.color.dark
  },
  regular: {
    ...theme.font.regular,
    color: theme.color.regular,
    fontSize: 25
  }
};

theme.text.regularCenter = {
  ...theme.text.regular,
  textAlign: 'center'
}

// default button styles
theme.button = {
  style: {
    backgroundColor: theme.color.dark,
    borderRadius: 10
  },
  icon: {
    size: 32
  },
  text: {
    ...theme.font.regular,
    color: theme.color.light,
    textAlign: 'center'
  },
  width: {
    regular: {
      width: PixelRatio.getPixelSizeForLayoutSize(50)
    }
  }
};

// default containers

theme.container = {
  regular: {
    flex: 1,
    backgroundColor: theme.color.light
  }
};

theme.container.center = {
  ...theme.container.regular,
  alignItems: 'center'
}

export default theme;
