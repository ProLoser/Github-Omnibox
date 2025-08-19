import "bootstrap/dist/css/bootstrap.min.css"
import React, { useState, useEffect } from "react"
import { Accordion, Button, Form, ListGroup, Container, Row, Col, InputGroup, Panel } from "react-bootstrap"

const defaultMenu = [
    { name: 'Gitter Chat', icon: '...', badge: '...', url: '...' },
    // ... other default menu items from help.js
];

const Options = () => {
  const [items, setItems] = useState([]);
  const [formItem, setFormItem] = useState({ name: "", url: "", icon: "", badge: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [saved, setSaved] = useState(false);
  const [testRepo, setTestRepo] = useState({ owner: "angular", repo: "angular" });

  useEffect(() => {
    chrome.storage.sync.get({ menu: defaultMenu }, (data) => {
      setItems(data.menu);
    });
  }, []);

  const handleSave = () => {
    const newItems = [...items];
    if (editingIndex !== null) {
      newItems[editingIndex] = formItem;
    } else {
      newItems.push(formItem);
    }
    setItems(newItems);
    chrome.storage.sync.set({ menu: newItems }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
    handleReset();
  };

  const handleEdit = (index) => {
    setFormItem({ ...items[index] });
    setEditingIndex(index);
  };

  const handleReset = () => {
    setFormItem({ name: "", url: "", icon: "", badge: "" });
    setEditingIndex(null);
  };

  const handleRemove = (index) => {
    if (window.confirm("Are you sure?")) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      chrome.storage.sync.set({ menu: newItems });
    }
  };

  const handleMove = (index, direction) => {
    const newItems = [...items];
    const [item] = newItems.splice(index, 1);
    newItems.splice(index + direction, 0, item);
    setItems(newItems);
    chrome.storage.sync.set({ menu: newItems });
  };

  const handleMessageBackend = (message: string) => {
    chrome.runtime.sendMessage(message);
  }

  const renderPreview = (item) => {
    const replaceTokens = (str) => str.replace(/:owner/g, testRepo.owner).replace(/:repo/g, testRepo.repo);
    if (!item.name) return null;
    return (
      <a href={replaceTokens(item.url || "")} target="_blank" rel="noreferrer">
        {item.icon && <img src={replaceTokens(item.icon)} style={{height: 16, marginRight: 4}} />}
        {item.badge && <img src={replaceTokens(item.badge)} />}
        {replaceTokens(item.name)}
      </a>
    )
  }

  return (
    <Container style={{ paddingTop: 20 }}>
      <h1>Github Omnibox</h1>
      <p>
        <Button onClick={() => handleMessageBackend('login')} variant="secondary">Github Login</Button>{' '}
        <Button onClick={() => handleMessageBackend('logout')} variant="secondary">Github Logout</Button>{' '}
        <Button onClick={() => handleMessageBackend('reset')} variant="secondary">Reset Cache</Button>
      </p>

      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            Status Badges {saved && <span style={{color: 'green', marginLeft: 10}}>SAVED!</span>}
          </Accordion.Header>
          <Accordion.Body>
            {/* Form for adding/editing items */}
            <Form>
                {/* Form fields would go here */}
            </Form>

            {/* Preview */}
            <div><strong>Preview: </strong>{renderPreview(formItem)}</div>

            {/* List of current items */}
            <ListGroup>
              {items.map((item, index) => (
                <ListGroup.Item key={index}>
                  {renderPreview(item)}
                  <div className="float-end">
                    <Button size="sm" variant="light" onClick={() => handleMove(index, -1)} disabled={index === 0}>Up</Button>{' '}
                    <Button size="sm" variant="danger" onClick={() => handleRemove(index)}>Remove</Button>{' '}
                    <Button size="sm" variant="info" onClick={() => handleEdit(index)}>Edit</Button>{' '}
                    <Button size="sm" variant="light" onClick={() => handleMove(index, 1)} disabled={index === items.length - 1}>Down</Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Omnibox Commands List</Accordion.Header>
          <Accordion.Body>
            <pre>
              my auth
              my unauth
              {/* ... The rest of the commands */}
            </pre>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  )
}

export default Options
