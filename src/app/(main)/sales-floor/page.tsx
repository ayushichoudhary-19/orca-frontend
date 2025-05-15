"use client";

import CustomTextInput from "@/components/Utils/CustomTextInput";
import { useCampaign } from "@/hooks/Campaign/useCampaign";
import { RootState } from "@/store/store";
import {
  Card,
  Text,
  Group,
  Button,
  TextInput,
  Divider,
  SegmentedControl,
  Title,
} from "@mantine/core";
import { IconChevronDown, IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { axiosClient } from "@/lib/axiosClient";
import { toast } from "@/lib/toast";

interface Post {
  _id: string;
  campaignId: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export default function SalesFloorUI() {
  const user = useSelector((state: RootState) => state.auth.user?.name);
  const userId = useSelector((state: RootState) => state.auth.user?.uid);
  const [title, setTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { getById } = useCampaign();
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);

  const fetchPosts = useCallback(async () => {
    if (!campaignId) return;
    setIsPostsLoading(true);
    try {
      const { data } = await axiosClient.get<Post[]>(`/api/posts/campaign/${campaignId}`);
      console.log("fetched posts:", data);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setIsPostsLoading(false);
    }
  }, [campaignId]);

  const handleDelete = async (postId: string) => {
    setIsPostsLoading(true);
    try {
      await axiosClient.delete(`/api/posts/${postId}`);
      toast.success("Post deleted successfully");
      await fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setIsPostsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCampaignData = async () => {
      if (!campaignId) return;
      try {
        const campaign = await getById(campaignId);
        setCampaignName(campaign.campaignName);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
        toast.error("Failed to load campaign data");
      }
    };
    fetchCampaignData();
  }, [campaignId, getById]);

  useEffect(() => {
    if (campaignId) fetchPosts();
  }, [campaignId, fetchPosts]);

  const handleCreatePost = async () => {
    if (!title.trim() || !postContent.trim()) {
      toast.error("Please provide both title and content for your post");
      return;
    }

    setIsLoading(true);
    try {
      await axiosClient.post("/api/posts", {
        campaignId,
        title,
        content: postContent,
        createdBy: userId,
      });

      setTitle("");
      setPostContent("");

      await fetchPosts();
      toast.success("Post created successfully");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredPosts = posts.filter((post) => {
    const search = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(search) ||
      post.content.toLowerCase().includes(search) ||
      post.createdBy.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <Title className="text-darker text-[32px] font-bold mb-3">Sales Floor</Title>

      <div className="flex gap-6 w-full h-[calc(100vh-120px)] overflow-hidden">
        {/* Sidebar */}
        <div className="min-w-[350px] max-w-[350px] overflow-y-auto flex-shrink-0">
          <div className="space-y-4">
            <Card radius="md" className="p-5 border" style={{ border: "1.5px solid #E8E4FF" }}>
              <Group justify="space-between" className="mb-4">
                <Group>
                  <div className="w-8 h-8 rounded-md bg-[#F4F0FF] flex items-center justify-center font-bold text-[12px] text-black">
                    AB
                  </div>
                  <Text fw={600} size="sm">
                    Chat Details
                  </Text>
                </Group>
                <div className="text-gray-500 text-lg">...</div>
              </Group>
              <Divider mb={10} />
              <Text fw={700} className="my-2 text-sm text-darker">
                Sales Floor Guidelines
              </Text>
              <ul className="list-disc list-inside text-sm text-tinteddark7 space-y-4 pl-0">
                <li>
                Use this for general feedback, questions, or announcements about the campaign. Companies can post calendar links to office hours for live Q&A as well.
                </li>
                <li>
                For questions about specific meetings or leads, please communicate in 1:1 messages with company campaign managers via email or our messaging functionality to keep the clutter and noise down
                </li>
                <li>
                For technical support issues, do not post here reach out to the ORCA technical support team via the chat button in the bottom corner of your screen
                </li>
                <li>Keep the language and tone professional :)</li>
              </ul>
            </Card>
            <Card radius="md" className="p-4" style={{ border: "1px solid #E8E4FF" }}>
              <Group className="flex items-center gap-3">
                <Image src="/icons/document.svg" height={26} width={26} alt="text-document" />
                <div className="flex flex-col">
                  <Text size="md" fw={700}>
                    What are sales floors?
                  </Text>
                  <Text size="sm" className="text-primary cursor-pointer font-semibold">
                    Click here to read more
                  </Text>
                </div>
              </Group>
            </Card>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <Card radius="md" withBorder className="p-5 mb-6" style={{ border: "1px solid #E8E4FF" }}>
            <Group className="mb-4 items-center">
              <div className="w-8 h-8 rounded-md bg-[#0C0A1C] text-white font-bold flex items-center justify-center text-[12px]">
                AB
              </div>
              <Text fw={600} size="sm">
                {user ?? "You"}
              </Text>
              <div className="w-full">
                <CustomTextInput
                  placeholder="Title"
                  className="mb-4 h-[40px]"
                  value={title}
                  onChange={(e) => setTitle(e.currentTarget.value)}
                />
                <CustomTextInput
                  multiline
                  placeholder="Start typing..."
                  className="mb-4 h-[80px]"
                  value={postContent}
                  rows={6}
                  onChange={(e) => setPostContent(e.currentTarget.value)}
                />
                <Button
                  variant="filled"
                  size="md"
                  className="rounded-[12px]"
                  onClick={handleCreatePost}
                  loading={isLoading}
                  disabled={!title.trim() || !postContent.trim()}
                >
                  Post
                </Button>
              </div>
            </Group>
          </Card>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <TextInput
              placeholder="Search"
              radius="md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              className="w-full md:w-[520px] border border-tinteddark1 h-[40px]"
              rightSection={
                <Image
                  src="/icons/search.svg"
                  alt="Search"
                  width={16}
                  height={16}
                  className="opacity-60"
                />
              }
            />

            <Button
              variant="outline"
              className="text-sm font-normal border-tinteddark1 bg-white rounded-lg text-[#6D6C77]"
              rightSection={<IconChevronDown size={16} />}
            >
              Sort by: Upvotes
            </Button>
          </div>

          <SegmentedControl
            data={[
              { label: "All Posts", value: "all" },
              { label: "Qualified Meetings", value: "qualified" },
            ]}
            value={activeTab}
            onChange={setActiveTab}
            w={350}
            withItemsBorders
            h={40}
            classNames={{
              root: "bg-white border border-[#B7B6BB]",
              indicator: "bg-primary h-[40px]",
              label: "data-[active]:text-white data-[active]:font-medium",
            }}
          />

          {isPostsLoading ? (
            <Card radius="md" className="p-4 flex justify-center items-center">
              <Text>Loading posts...</Text>
            </Card>
          ) : filteredPosts.length > 0 ? (
            <div className="space-y-4 mt-4">
              {filteredPosts.map((post, idx) => (
                <Card
                  key={idx}
                  withBorder
                  radius="md"
                  className="p-4"
                  style={{ border: "1px solid #E8E4FF" }}
                >
                  <Group className="mb-2" justify="space-between">
                    <Group>
                      <div className="w-8 h-8 rounded-md bg-[#F4F0FF] flex items-center justify-center font-bold text-[12px] text-black">
                        {post.createdBy.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <Text fw={600} size="sm">
                          {post.createdBy}
                        </Text>
                        <Text size="xs" color="dimmed">
                          {formatDate(post.createdAt)}
                        </Text>
                      </div>
                    </Group>
                    <IconTrash
                      size={16}
                      color="red"
                      className="hover:cursor-pointer"
                      onClick={() => handleDelete(post._id)}
                    />
                  </Group>
                  <Text fw={700} className="mb-2">
                    {post.title}
                  </Text>
                  <Text className="text-tinteddark7">{post.content}</Text>
                </Card>
              ))}
            </div>
          ) : (
            <Card
              withBorder
              radius="md"
              className="py-2 h-[60px] flex flex-row gap-2 items-center mt-4"
              style={{ border: "1px solid #E8E4FF" }}
            >
              <Image src="/icons/message.svg" height={20} width={20} alt="chat-icon" />
              <Text size="sm" className="text-tinteddark6">
                No posts found for {searchQuery} in {campaignName}
              </Text>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
