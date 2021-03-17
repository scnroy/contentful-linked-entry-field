import * as React from 'react';
import { render } from 'react-dom';
import { TextInput } from '@contentful/forma-36-react-components';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

interface AppProps {
  sdk: FieldExtensionSDK;
}

interface Article {
  fields: {
    title: {
      'en-US': string
    }
  }
}

export default function App({sdk}: AppProps): JSX.Element {
  const anchorField = sdk.entry.fields['anchor']
  const [fieldValue, setFieldValue] = React.useState(sdk.field.getValue() || '')
  const [linkedEntryTitle, setLinkedEntryTitle] = React.useState('')
  const [anchor, setAnchor] = React.useState(anchorField.getValue() || '')


  React.useEffect( () => {
    const sys = sdk.entry.getSys()
    async function fetchInboundLink(): Promise<void> {
      const {items}: {items: Article[]} = await sdk.space.getEntries({'links_to_entry': sys.id})
      setLinkedEntryTitle(items.shift()?.fields.title['en-US'] || '')
    }

    fetchInboundLink()
  })

  React.useEffect( () => {
      const name = `[${anchor}] ${linkedEntryTitle}`
      setFieldValue(name)
      sdk.field.setValue(name)
  }, [sdk.field, anchor, linkedEntryTitle])

  React.useEffect(() => {
    const detach = sdk.entry.fields['anchor'].onValueChanged((value) => setAnchor(value))
    return () => detach()
  }, [sdk.entry])


  React.useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk.window])

  return (
    <TextInput
        width="large"
        type="text"
        id="my-field"
        testId="my-field"
        value={fieldValue}
        disabled
      />
  )
}

init(sdk => {
  render(<App sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
