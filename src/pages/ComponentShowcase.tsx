import React, { useState } from 'react';
import * as Components from '../components';
import { colors, spacing } from '../theme/theme';

export const ComponentShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('layout');
  const [toasts, setToasts] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addToast = (type: 'info' | 'success' | 'warning' | 'error') => {
    const newToast = {
      id: Date.now().toString(),
      type,
      message: `This is a ${type} toast message!`,
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const sectionStyles: React.CSSProperties = {
    marginBottom: spacing.xxl,
  };

  const titleStyles: React.CSSProperties = {
    marginBottom: spacing.lg,
    color: colors.primary,
  };

  const demoStyles: React.CSSProperties = {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: '8px',
    marginBottom: spacing.md,
  };

  const tabs = [
    { id: 'layout', label: 'Layout', content: <LayoutComponents /> },
    { id: 'navigation', label: 'Navigation', content: <NavigationComponents /> },
    { id: 'form', label: 'Forms', content: <FormComponents /> },
    { id: 'feedback', label: 'Feedback', content: <FeedbackComponents /> },
    { id: 'display', label: 'Data Display', content: <DataDisplayComponents /> },
    { id: 'media', label: 'Media', content: <MediaComponents /> },
    { id: 'interactive', label: 'Interactive', content: <InteractiveComponents /> },
    { id: 'utility', label: 'Utility', content: <UtilityComponents /> },
  ];

  return (
    <Components.ErrorBoundary>
      <Components.Container>
        <Components.Header
          title="React Component Showcase"
          subtitle="Mobile-first components built with TypeScript"
          sticky={true}
        />

        <Components.Tabs
          tabs={tabs}
          defaultTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
        />

        <Components.ToastContainer toasts={toasts} onClose={removeToast} />
        <Components.ScrollToTop />
      </Components.Container>
    </Components.ErrorBoundary>
  );

  function LayoutComponents() {
    return (
      <div>
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Grid System</h2>
          <div style={demoStyles}>
            <Components.Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
              <Components.Card>Grid Item 1</Components.Card>
              <Components.Card>Grid Item 2</Components.Card>
              <Components.Card>Grid Item 3</Components.Card>
              <Components.Card>Grid Item 4</Components.Card>
              <Components.Card>Grid Item 5</Components.Card>
              <Components.Card>Grid Item 6</Components.Card>
            </Components.Grid>
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Flexbox Layout</h2>
          <div style={demoStyles}>
            <Components.Flex justify="between" align="center" gap="md">
              <Components.Card>Flex Item 1</Components.Card>
              <Components.Card>Flex Item 2</Components.Card>
              <Components.Card>Flex Item 3</Components.Card>
            </Components.Flex>
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Sidebar</h2>
          <div style={demoStyles}>
            <Components.Button onClick={() => setSidebarOpen(true)}>
              Open Sidebar
            </Components.Button>
            <Components.Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
              <h3>Sidebar Content</h3>
              <p>This is a mobile-friendly sidebar component.</p>
              <Components.List>
                <Components.ListItem>Menu Item 1</Components.ListItem>
                <Components.ListItem>Menu Item 2</Components.ListItem>
                <Components.ListItem>Menu Item 3</Components.ListItem>
              </Components.List>
            </Components.Sidebar>
          </div>
        </section>
      </div>
    );
  }

  function NavigationComponents() {
    return (
      <div>
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Navigation Bar</h2>
          <div style={demoStyles}>
            <Components.Navbar
              brand="Kooka Sing"
              links={[
                { label: 'Home', href: '#', active: true },
                { label: 'About', href: '#' },
                { label: 'Services', href: '#' },
                { label: 'Contact', href: '#' },
              ]}
              onLinkClick={(link) => console.log('Clicked:', link)}
            />
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Tab Bar</h2>
          <div style={demoStyles}>
            <Components.TabBar
              tabs={[
                { id: 'home', label: 'Home', icon: <Components.Icon name="home" size="small" /> },
                { id: 'search', label: 'Search', icon: <Components.Icon name="search" size="small" /> },
                { id: 'profile', label: 'Profile', icon: <Components.Icon name="person" size="small" />, badge: 3 },
              ]}
              activeTab="home"
              onTabChange={(tabId) => console.log('Tab changed:', tabId)}
            />
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Breadcrumbs</h2>
          <div style={demoStyles}>
            <Components.Breadcrumbs
              items={[
                { label: 'Home', href: '#' },
                { label: 'Products', href: '#' },
                { label: 'Electronics', href: '#' },
                { label: 'Smartphones' },
              ]}
            />
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Drawer</h2>
          <div style={demoStyles}>
            <Components.Button onClick={() => setDrawerOpen(true)}>
              Open Bottom Drawer
            </Components.Button>
            <Components.Drawer
              isOpen={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              title="Select an Option"
            >
              <Components.List>
                <Components.ListItem onClick={() => setDrawerOpen(false)}>Option 1</Components.ListItem>
                <Components.ListItem onClick={() => setDrawerOpen(false)}>Option 2</Components.ListItem>
                <Components.ListItem onClick={() => setDrawerOpen(false)}>Option 3</Components.ListItem>
              </Components.List>
            </Components.Drawer>
          </div>
        </section>
      </div>
    );
  }

  function FormComponents() {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: '',
      country: '',
      subscribe: false,
      plan: 'free',
      notifications: true,
    });

    return (
      <div>
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Form Inputs</h2>
          <div style={demoStyles}>
            <Components.Flex direction="column" gap="md">
              <Components.Input
                label="Name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                icon={<Components.Icon name="person" size="small" />}
              />
              
              <Components.Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon={<Components.Icon name="email" size="small" />}
                error={formData.email && !formData.email.includes('@') ? 'Invalid email' : ''}
              />
              
              <Components.TextArea
                label="Message"
                placeholder="Enter your message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                hint="Maximum 500 characters"
              />
              
              <Components.Select
                label="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                options={[
                  { value: 'us', label: 'United States' },
                  { value: 'uk', label: 'United Kingdom' },
                  { value: 'ca', label: 'Canada' },
                  { value: 'au', label: 'Australia' },
                ]}
              />
            </Components.Flex>
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Checkboxes & Radio Buttons</h2>
          <div style={demoStyles}>
            <Components.Flex direction="column" gap="md">
              <Components.Checkbox
                label="Subscribe to newsletter"
                checked={formData.subscribe}
                onChange={(e) => setFormData({ ...formData, subscribe: e.target.checked })}
              />
              
              <Components.RadioGroup
                name="plan"
                value={formData.plan}
                onChange={(value) => setFormData({ ...formData, plan: value })}
                options={[
                  { value: 'free', label: 'Free Plan' },
                  { value: 'pro', label: 'Pro Plan' },
                  { value: 'enterprise', label: 'Enterprise Plan' },
                ]}
              />
              
              <Components.Switch
                label="Enable notifications"
                checked={formData.notifications}
                onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
              />
            </Components.Flex>
          </div>
        </section>
      </div>
    );
  }

  function FeedbackComponents() {
    return (
      <div>
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Alerts</h2>
          <div style={demoStyles}>
            <Components.Flex direction="column" gap="md">
              <Components.Alert type="info" title="Information" message="This is an informational alert." />
              <Components.Alert type="success" title="Success" message="Operation completed successfully!" />
              <Components.Alert type="warning" title="Warning" message="Please review before continuing." />
              <Components.Alert type="error" title="Error" message="An error occurred. Please try again." onClose={() => {}} />
            </Components.Flex>
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Toasts</h2>
          <div style={demoStyles}>
            <Components.Flex gap="sm" wrap="wrap">
              <Components.Button size="small" onClick={() => addToast('info')}>Info Toast</Components.Button>
              <Components.Button size="small" onClick={() => addToast('success')} variant="secondary">Success Toast</Components.Button>
              <Components.Button size="small" onClick={() => addToast('warning')} variant="outline">Warning Toast</Components.Button>
              <Components.Button size="small" onClick={() => addToast('error')}>Error Toast</Components.Button>
            </Components.Flex>
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Modal</h2>
          <div style={demoStyles}>
            <Components.Button onClick={() => setModalOpen(true)}>
              Open Modal
            </Components.Button>
            <Components.Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Modal Title"
              footer={
                <>
                  <Components.Button variant="outline" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Components.Button>
                  <Components.Button onClick={() => setModalOpen(false)}>
                    Confirm
                  </Components.Button>
                </>
              }
            >
              <p>This is a modal dialog with custom content and actions.</p>
            </Components.Modal>
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Progress Indicators</h2>
          <div style={demoStyles}>
            <Components.Flex direction="column" gap="md">
              <Components.Progress value={25} label="Upload Progress" showValue />
              <Components.Progress value={60} color={colors.secondary} showValue />
              <Components.Progress value={90} color={colors.success} showValue />
              <Components.Flex gap="lg">
                <Components.Progress value={30} variant="circular" showValue />
                <Components.Progress value={65} variant="circular" size="large" showValue />
              </Components.Flex>
            </Components.Flex>
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Skeleton Loaders</h2>
          <div style={demoStyles}>
            <Components.SkeletonGroup>
              <Components.Skeleton variant="text" />
              <Components.Skeleton variant="text" width="80%" />
              <Components.Skeleton variant="rectangular" height="200px" />
            </Components.SkeletonGroup>
          </div>
        </section>
      </div>
    );
  }

  function DataDisplayComponents() {
    return (
      <div>
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Avatars</h2>
          <div style={demoStyles}>
            <Components.Flex gap="md" align="center">
              <Components.Avatar name="John Doe" />
              <Components.Avatar src="/img/kooka-burra-flying.png" alt="Kooka" size="large" />
              <Components.Avatar name="Jane Smith" size="large" status="online" />
              <Components.AvatarGroup>
                <Components.Avatar name="User 1" size="small" />
                <Components.Avatar name="User 2" size="small" />
                <Components.Avatar name="User 3" size="small" />
                <Components.Avatar name="User 4" size="small" />
                <Components.Avatar name="User 5" size="small" />
              </Components.AvatarGroup>
            </Components.Flex>
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Badges & Chips</h2>
          <div style={demoStyles}>
            <Components.Flex gap="md" wrap="wrap">
              <Components.Badge count={5}>
                <Components.Icon name="message" />
              </Components.Badge>
              <Components.Badge count={99} color="primary">
                <Components.Icon name="email" />
              </Components.Badge>
              <Components.Badge dot color="success">
                <Components.Icon name="person" />
              </Components.Badge>
            </Components.Flex>
            <Components.Spacer />
            <Components.ChipGroup>
              <Components.Chip label="React" color="primary" />
              <Components.Chip label="TypeScript" color="secondary" icon={<Components.Icon name="check" size="small" />} />
              <Components.Chip label="Mobile First" variant="outlined" onDelete={() => {}} />
              <Components.Chip label="Selected" selected onClick={() => {}} />
            </Components.ChipGroup>
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Lists</h2>
          <div style={demoStyles}>
            <Components.List divider>
              <Components.ListSubheader>Settings</Components.ListSubheader>
              <Components.ListItem
                icon={<Components.Icon name="person" />}
                action={<Components.Switch />}
              >
                Profile Settings
              </Components.ListItem>
              <Components.ListItem
                icon={<Components.Icon name="email" />}
                subtitle="Manage your email preferences"
                action={<Components.Icon name="forward" />}
              >
                Email Notifications
              </Components.ListItem>
              <Components.ListItem
                icon={<Components.Icon name="settings" />}
                selected
              >
                Advanced Settings
              </Components.ListItem>
            </Components.List>
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Table</h2>
          <div style={demoStyles}>
            <Components.Table
              data={[
                { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
                { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
              ]}
              columns={[
                { key: 'id', header: 'ID', width: '80px' },
                { key: 'name', header: 'Name' },
                { key: 'email', header: 'Email' },
                { key: 'role', header: 'Role', render: (value) => (
                  <Components.StandaloneBadge 
                    label={value} 
                    color={value === 'Admin' ? 'primary' : 'default'} 
                  />
                )},
              ]}
              striped
              hoverable
            />
          </div>
        </section>
      </div>
    );
  }

  function MediaComponents() {
    return (
      <div>
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Images</h2>
          <div style={demoStyles}>
            <Components.Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
              <Components.Image
                src="/img/kooka-burra-calling-out.png"
                alt="Kooka singing"
                rounded
                aspectRatio="100%"
              />
              <Components.Image
                src="/img/kooka-burra-dancing.png"
                alt="Kooka waving"
                rounded="lg"
                aspectRatio="100%"
              />
              <Components.Image
                src="/invalid-image.jpg"
                alt="Fallback demo"
                fallbackSrc="/img/kooka-burra-flying.png"
                rounded
                aspectRatio="100%"
              />
            </Components.Grid>
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Icons</h2>
          <div style={demoStyles}>
            <Components.Grid columns={{ mobile: 6, tablet: 8, desktop: 12 }} gap="md">
              {['home', 'search', 'person', 'settings', 'email', 'phone', 'star', 'heart', 'check', 'close', 'add', 'remove'].map(icon => (
                <Components.Flex key={icon} direction="column" align="center" gap="xs">
                  <Components.Icon name={icon} />
                  <span style={{ fontSize: '12px' }}>{icon}</span>
                </Components.Flex>
              ))}
            </Components.Grid>
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Audio Player</h2>
          <div style={demoStyles}>
            <Components.AudioPlayer
              src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
              title="Sample Audio"
              artist="Sound Helix"
              cover="/img/kooka-burra-flying-blue-sky-clouds-bg.jpg"
              variant="full"
            />
          </div>
        </section>
      </div>
    );
  }

  function InteractiveComponents() {
    return (
      <div>
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Accordion</h2>
          <div style={demoStyles}>
            <Components.Accordion
              items={[
                {
                  id: '1',
                  title: 'What is Kooka Sing?',
                  content: 'Kooka Sing is an interactive music education app for children.',
                  icon: <Components.Icon name="info" size="small" />
                },
                {
                  id: '2',
                  title: 'How does it work?',
                  content: 'Children can learn music through fun, interactive lessons and games.',
                  icon: <Components.Icon name="settings" size="small" />
                },
                {
                  id: '3',
                  title: 'Is it suitable for all ages?',
                  content: 'Yes, Kooka Sing is designed for children of all ages and skill levels.',
                  icon: <Components.Icon name="group" size="small" />
                },
              ]}
              defaultExpanded={['1']}
              allowMultiple
            />
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Tooltips</h2>
          <div style={demoStyles}>
            <Components.Flex gap="lg">
              <Components.Tooltip content="This is a top tooltip" position="top">
                <Components.Button size="small">Top</Components.Button>
              </Components.Tooltip>
              <Components.Tooltip content="This is a right tooltip" position="right">
                <Components.Button size="small">Right</Components.Button>
              </Components.Tooltip>
              <Components.Tooltip content="This is a bottom tooltip" position="bottom">
                <Components.Button size="small">Bottom</Components.Button>
              </Components.Tooltip>
              <Components.Tooltip content="This is a left tooltip" position="left">
                <Components.Button size="small">Left</Components.Button>
              </Components.Tooltip>
            </Components.Flex>
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Popovers</h2>
          <div style={demoStyles}>
            <Components.Flex gap="lg">
              <Components.Popover
                content={
                  <div>
                    <h4>Popover Title</h4>
                    <p>This is a click-triggered popover with rich content.</p>
                    <Components.Button size="small">Action</Components.Button>
                  </div>
                }
                trigger="click"
              >
                <Components.Button variant="outline">Click Popover</Components.Button>
              </Components.Popover>
              
              <Components.Popover
                content="This is a hover-triggered popover"
                trigger="hover"
                position="top"
              >
                <Components.Button variant="outline">Hover Popover</Components.Button>
              </Components.Popover>
            </Components.Flex>
          </div>
        </section>
      </div>
    );
  }

  function UtilityComponents() {
    return (
      <div>
        <section style={sectionStyles}>
          <h2 style={titleStyles}>Dividers</h2>
          <div style={demoStyles}>
            <p>Content above divider</p>
            <Components.Divider />
            <p>Content below divider</p>
            <Components.Divider variant="dashed" color={colors.primary} />
            <p>Content with text divider</p>
            <Components.Divider>OR</Components.Divider>
            <p>Content after text divider</p>
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Spacers</h2>
          <div style={demoStyles}>
            <Components.Flex direction="column">
              <Components.Card>Card 1</Components.Card>
              <Components.Spacer size="xs" />
              <Components.Card>Card 2 (xs spacing)</Components.Card>
              <Components.Spacer size="md" />
              <Components.Card>Card 3 (md spacing)</Components.Card>
              <Components.Spacer size="xl" />
              <Components.Card>Card 4 (xl spacing)</Components.Card>
            </Components.Flex>
          </div>
        </section>

        <section style={sectionStyles}>
          <h2 style={titleStyles}>Scroll Area</h2>
          <div style={demoStyles}>
            <Components.ScrollArea height="200px" showScrollbar="hover">
              <Components.List>
                {Array.from({ length: 20 }, (_, i) => (
                  <Components.ListItem key={i}>
                    Scrollable Item {i + 1}
                  </Components.ListItem>
                ))}
              </Components.List>
            </Components.ScrollArea>
          </div>
        </section>
      </div>
    );
  }
};