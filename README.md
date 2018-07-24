## react-cool-layout

### Why react-cool-layout
react-cool-layout is a responsive layout engine based on runtime js calculation.

The idea is that you can declare a dynamic way of getting position info like `left`, `top` and size info like `width`, `height` for each layout item. One layout item (say component A) can declare dependencies of another (say component B). If size/position info of B changes, size/position info of A will be changed automatically according to the way that is declared for setting the position/size property based on the new state of component B. Let's take the following code snippets as an example:

```jsx
  <Layout>
    <Layout.Item
      id="1"
      left={lib => {
        // here we're declaring left of item with id '1' depends on the width of item '3'
        // so if something happens and causing dom state of item 3 changes, left of item '1'
        // will be automatically recalculated based on the function declared here 
        const width = lib.page().width - lib.get('1').width - lib.get('3').width - 200;
        return parseInt(width / 2);
      }}
      style={{
        background: 'red',
      }}
    >
      <div style={{
        width: 200,
        height: 200,
      }} />
    </Layout.Item>

    <Layout.Item
      left={lib => {
        // here we're declaring left of item '2' depends on the left of item '1' 
        // so if something happens and causing dom state of item 1 changes, left of item '2'
        // will be automatically recalculated based on the function declared here 
        const width = lib.get('1').left + 200 + 200;
        return parseInt(width);
      }}
      id="2"
    >
      <div style={{
        width: 200,
        height: 80,
        background: 'yellow'
      }} />
    </Layout.Item>
  </Layout>
}

```

### Limitation

* The dependencies management is managed by react-cool-layout and we use [MutationObserver](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) to automatically register all subscriptions. Thus browsers or polyfil that supports MutationObserver is required.
* Currently, we don't support re-rendering of react-cool-layout. [#12](https://github.com/zinkey/react-cool-layout/issues/12)

### Install

```
$ npm install react-cool-layout
```

### Examples
```
$ npm run dev 
```

http://localhost:1234/

Examples can be found [here](https://github.com/zinkey/react-cool-layout/tree/master/examples).

