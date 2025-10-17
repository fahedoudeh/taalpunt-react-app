//Sidebar + Header wraper

// This wraps pages with consistent sidebar + header


<Layout>
  <Sidebar /> // Navigation menu
  <div>
    <Header /> // User info, logout button
    <main>{children}</main> // Page content
  </div>
</Layout>