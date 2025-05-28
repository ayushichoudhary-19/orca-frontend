export function createShadowRoot(container: HTMLElement): ShadowRoot {
  // Check if shadow root already exists
  if (container.shadowRoot) {
    return container.shadowRoot;
  }
  
  const shadow = container.attachShadow({ mode: "open" });

  // Add stylesheets
  const style1 = document.createElement("link");
  style1.setAttribute("rel", "stylesheet");
  style1.setAttribute("href", "/_next/static/css/@blocknote/mantine/style.css");

  const style2 = document.createElement("link");
  style2.setAttribute("rel", "stylesheet");
  style2.setAttribute("href", "/_next/static/css/@blocknote/core/fonts/inter.css");

  shadow.appendChild(style1);
  shadow.appendChild(style2);

  return shadow;
}